/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Example2, Example2Interface } from "../Example2";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "num",
        type: "uint8",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "vestedNFTs",
        type: "uint128",
      },
    ],
    name: "setUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingNFT",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516104a13803806104a183398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b61040e806100936000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80630f98977d146100465780633ec0c1b91461007557806395d4063f1461008a575b600080fd5b600054610059906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b61008861008336600461032a565b61009d565b005b61008861009836600461037b565b6101ba565b60008181805b6001600160801b038316156100f957600180841614156100d75760ff82166100c9578091505b6100d46001856103a5565b93505b6100e26001826103a5565b90506001836001600160801b0316901c92506100a3565b506040805160808101825260ff9485168152918416602080840191825260008484018181526001600160801b03988916606087019081526001600160a01b03909a1682526001909252929092209251835491519251975190961663010000000272ffffffffffffffffffffffffffffffff0000001997861662010000029790971672ffffffffffffffffffffffffffffffffff0000199286166101000261ffff19909216969095169590951794909417939093169190911792909217905550565b336000908152600160209081526040918290208251608081018452905460ff80821683526101008204811693830184905262010000820416938201849052630100000090046001600160801b0316606082018190529092309291821c5b8560ff168260ff1610156102ef57600180821614156102c8576000546001600160a01b03166323b872dd853361024e8760016103a5565b6040516001600160e01b031960e086901b1681526001600160a01b03938416600482015292909116602483015260ff166044820152606401600060405180830381600087803b1580156102a057600080fd5b505af11580156102b4573d6000803e3d6000fd5b505050506001826102c591906103a5565b91505b6102d36001846103a5565b925060011c6f7fffffffffffffffffffffffffffffff16610217565b50336000908152600160205260409020805462ffff0019166201000060ff9384160261ff001916176101009390921692909202179055505050565b6000806040838503121561033d57600080fd5b82356001600160a01b038116811461035457600080fd5b915060208301356001600160801b038116811461037057600080fd5b809150509250929050565b60006020828403121561038d57600080fd5b813560ff8116811461039e57600080fd5b9392505050565b600060ff821660ff84168060ff038211156103d057634e487b7160e01b600052601160045260246000fd5b01939250505056fea2646970667358221220555a5a82653827baf4828403aa3728cf2ff013614228675476bc676f3ece38c564736f6c634300080b0033";

export class Example2__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    nftAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Example2> {
    return super.deploy(nftAddress, overrides || {}) as Promise<Example2>;
  }
  getDeployTransaction(
    nftAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(nftAddress, overrides || {});
  }
  attach(address: string): Example2 {
    return super.attach(address) as Example2;
  }
  connect(signer: Signer): Example2__factory {
    return super.connect(signer) as Example2__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Example2Interface {
    return new utils.Interface(_abi) as Example2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Example2 {
    return new Contract(address, _abi, signerOrProvider) as Example2;
  }
}
