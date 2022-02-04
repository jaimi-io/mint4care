import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";

export const getLibrary = (
  provider: ExternalProvider | JsonRpcFetchFunc
): Web3Provider => {
  const library = new Web3Provider(provider);
  return library;
};

const AVAX_FUJI = 43113;
const AVAX_LOCAL = 43112;
const supportedChains = [AVAX_LOCAL, AVAX_FUJI];

export const connector = new InjectedConnector({
  supportedChainIds: supportedChains,
});

export const getAccountString = (account?: string | null): string => {
  if (!account) {
    return "Connect Wallet";
  }
  const START_CHARS = 8;
  const END_CHARS = 4;
  return `${account.slice(0, START_CHARS)}....${account.slice(-END_CHARS)}`;
};
