import * as chains from 'viem/chains';
import { isChainValid, isJsonRpcUrlValid } from './validators/index.js';
import { importWasms, generateProof } from './noir/index.js';

import type { CompiledCircuit, ProofData } from '@noir-lang/backend_barretenberg';
import type { Chain } from 'viem/chains';
class SDK {
    chainId: number;
    chainName: string;
    rpcUrl: string;
    initialized: boolean = false;

    constructor({ chainName, rpcUrl }: { chainName: string, rpcUrl: string }) {
      if (!isChainValid(chainName)) {
        throw new Error(`Chain ${chainName} is not supported`);
      }
      if(!isJsonRpcUrlValid(rpcUrl)) {
        throw new Error(`Invalid JSON RPC URL: ${rpcUrl}`);
      }
      const chain = chains[chainName as unknown as keyof typeof chains] as Chain;
   
      this.chainName = chainName;
      this.chainId = chain.id;
      this.rpcUrl = rpcUrl;
    }

    public init = async () => {
      if (this.initialized) {
        return;
      }
      console.log('Initializing Vlayer SDK... ⌛')
      await importWasms();
      this.initialized = true;
    }

    public generateKeccakProof = async ({ x }: { x: number}) => {
      await this.init();
      const proof = await generateProof('keccak', { x }, this)

      return proof;
    }

    public generateApeProof = async ({ block_number, token_id, wallet_address }: { block_number: number, token_id: number[], wallet_address: number[] }) => {
      try {
        await this.init();
        console.log('Generating proof... ⌛');
        const proof = await generateProof("is_ape_owner", {
          chain_id: this.chainId,
          block_number,
          token_id,
          wallet_address
        }, this);

        return proof;
      } catch(error) {
        console.log(error);
        return { error: (error as Error).message };
      }
    }  
}

export type {
  CompiledCircuit,
  ProofData,
};

export {
  SDK
}