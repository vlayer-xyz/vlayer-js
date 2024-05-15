import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  input: 'index.ts',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    typescript(), 
    json(), 
    nodeResolve({ 
      browser: true,
    }),
    copy({
      targets: [
        { src: 'node_modules/@noir-lang/acvm_js/web/acvm_js_bg.wasm', dest: 'dist' },
        { src: 'node_modules/@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm', dest: 'dist' },
      ]
    })
  ]
};