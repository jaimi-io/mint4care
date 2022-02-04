# Mint4Care NFT Vesting

## Smart Contracts (Call Sequence)

### Initialisation

- Deploy Mint4CareNFT(name, symbol, baseURI)
- Deploy Vesting(Mint4CareNFT.address)

### Pre-vesting (Calls by admin)

Set vesting data

- Vesting.setUser(userAddress, tokenIds) or Vesting.setUsers([userAddress1, ...], [tokenIds1, ...])

Mint 100 NFTs to vesting contract

- Mint4CareNFT.mint(Vesting.address)

- Vesting.startVesting(timestamp, cliffPeriod, releasePeriod, securityPeriod)

timestamp = 0, to start vesting immediately
releasePeriod = time in s for one NFT to be released

### Vesting (Calls by users)

Pause/resume user vesting schedule

- Vesting.pause()
- Vesting.unpause()

Claim all released NFTs

- Vesting.claim()

### Post-vesting (Calls by admin)

Reclaim remaining NFTs

- Vesting.reclaimNFTs(receiverAddress)

## Frontend

I focused on the user side so made a User Vesting Dashboard with the vesting contract address editable for demo purposes.

To run frontend:

```bash
cd frontend && yarn && yarn start
```

![Frontend Screenshot](/FrontendScreenshot.png)

## Additional Notes

I have a different approach to the vesting contract on bitmap-vesting branch. By using a bitmap over an array to store vesting data I am able to do validation on when vesting data is provided by admin. Although this is a bit more expensive and less readable, it is more secure as my other implementation assumes that admin always provides accurate user vesting data.
