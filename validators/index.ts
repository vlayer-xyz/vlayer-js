import * as chains from 'viem/chains';
import type { Chain } from 'viem';

export const SUPPORTED_CHAINS = ["mainnet", "sepolia"]; 

export const isChainValid = (chainName: string) => {
  const chain = chains[chainName as unknown as keyof typeof chains] as Chain;

  if(chain === undefined) return false;
  if(!SUPPORTED_CHAINS.includes(chainName)) return false;

  return true;
}

export const isJsonRpcUrlValid = (rpcUrl: string) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  
  return urlRegex.test(rpcUrl);
}