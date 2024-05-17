import { MultiChainClient, getChainByName } from 'noir-ethereum-api-oracles/dist/src/ethereum/client';
import { alchemyActions } from 'noir-ethereum-api-oracles/dist/src/ethereum/alchemyClient';
import { createOracles, defaultOraclesMap } from 'noir-ethereum-api-oracles/dist/src/noir/oracles/oracles.js';
import { createPublicClient, http } from 'viem';

export const clientOracles = (chainName: string, rpcUrl: string) => {
  const chain = getChainByName(chainName);
  const client = createPublicClient({ chain, transport: http(rpcUrl) }).extend(alchemyActions())
  
  return createOracles(MultiChainClient.from(client))(defaultOraclesMap);
}
