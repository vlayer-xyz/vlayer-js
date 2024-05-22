import { Noir } from '@noir-lang/noir_js';
import type { CompiledCircuit, ProofData } from '@noir-lang/backend_barretenberg';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { clientOracles } from './oracles.js';

export const importWasms = async () => {
  await Promise.all([
    import("@noir-lang/noirc_abi").then(module => 
      module.default(new URL("@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm", import.meta.url).toString())
    ),
    import("@noir-lang/acvm_js").then(module => 
      module.default(new URL("@noir-lang/acvm_js/web/acvm_js_bg.wasm", import.meta.url).toString())
    )
  ]);
}

export const generateProof = async (circuitName: string, inputs: any, sdk: any) => {
  const circuit  =  await import(`../../circuits/${circuitName}.json`);
  const backend = new BarretenbergBackend(circuit as CompiledCircuit);
  const noir = new Noir(circuit as CompiledCircuit, backend);

  if(circuitName === "is_ape_owner") {
    return noir.generateProof(inputs, clientOracles(sdk.chainName, sdk.rpcUrl));
  } else {
    return noir.generateProof(inputs);
  }
  
}