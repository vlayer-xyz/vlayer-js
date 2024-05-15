import type { CompiledCircuit, ProofData } from '@noir-lang/backend_barretenberg';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { defaultOracles } from 'noir-ethereum-api-oracles/dist/src/noir/oracles/oracles.js';

class SDK {
    public init = async () => {
      await Promise.all([
        import("@noir-lang/noirc_abi").then(module => 
          module.default(new URL("@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm", import.meta.url).toString())
        ),
        import("@noir-lang/acvm_js").then(module => 
          module.default(new URL("@noir-lang/acvm_js/web/acvm_js_bg.wasm", import.meta.url).toString())
        )
      ]);
    }

    public generateKeccakProof = async () => {
      const circuit  =  await import('./circuits/keccak.json');

      const backend = new BarretenbergBackend(circuit as CompiledCircuit);
      const noir = new Noir(circuit as CompiledCircuit, backend);
      console.log('Generating proof... ⌛');
      const proof = await noir.generateProof({
        x: 0,
      });
      console.log('results', proof.proof);

      return proof;
    }

    public generateApeProof = async () => {
      try {
        const circuit  =  await import('./circuits/is_ape_owner.json');
        const backend = new BarretenbergBackend(circuit as CompiledCircuit);
        const noir = new Noir(circuit as CompiledCircuit, backend);
        const oracles = defaultOracles;
        console.log('Generating proof... ⌛');
        const proof = await noir.generateProof({
          block_number: 19000000,
          token_id: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
          wallet_address: [0x13, 0x70, 0x24, 0xfc, 0xa6, 0xcd, 0x54, 0x2e, 0x95, 0x97, 0xd5, 0xa5, 0x51, 0xeb, 0xb1, 0xbd, 0x12, 0xdc, 0xc7, 0x03]
        });

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