import { SDK } from './index';
import { it, describe, expect, vi, afterEach } from 'vitest'
import { importWasms, generateProof } from './noir/index';
import { mainnet } from 'viem/chains';

describe('constructor()', () => {
  it('should set chainName, chainId and rpcUrl', () => {
    const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });

    expect(sdk.chainName).toBe('mainnet');
    expect(sdk.chainId).toBe(1);

    expect(sdk.rpcUrl).toBe('https://rpc.url');
  });

  it('should throw an error if chain is not viem supported', () => {
    try {
      new SDK({ chainName: 'invalid', rpcUrl: 'https://rpc.url' });
    } catch (error) {
      expect((error as Error).message).toBe('Unsupported chain: invalid');
    }
  });  

  it('should throw an error if chain is not vlayer supported', () => {
    try {
      new SDK({ chainName: 'polygon', rpcUrl: 'https://rpc.url' });
    } catch (error) {
      expect((error as Error).message).toBe('Unsupported chain: polygon');
    }
  });

  it('should throw an error if rpcUrl is invalid', () => {
    try {
      new SDK({ chainName: 'sepolia', rpcUrl: 'invalid' });
    } catch (error) {
      expect((error as Error).message).toBe('Invalid JSON RPC URL: invalid');
    }
  });
});

describe('init()', () => { 
  vi.mock('./noir/index', () => {
    return {
      importWasms: vi.fn(),
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should import wasms', async () => {
    const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });
    await sdk.init();

    expect(sdk.initialized).toBe(true);
    expect(importWasms).toBeCalledTimes(1);
  });

  it('should not import wasms if already initialized', async () => {
    const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });
    await sdk.init();
    await sdk.init();

    expect(sdk.initialized).toBe(true);
    expect(importWasms).toBeCalledTimes(1);
  });
});

describe('generateKeccakProof()', () => {
  vi.mock('./noir/index', () => {
    return {
      importWasms: vi.fn(),
      generateProof: vi.fn(),
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should import wasms once', async () => {
    const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });
    expect(importWasms).toBeCalledTimes(0);
    
    await sdk.generateKeccakProof({ x: 1 });
    expect(importWasms).toBeCalledTimes(1);
    await sdk.generateKeccakProof({ x: 1 });
    expect(importWasms).toBeCalledTimes(1);
  });

  it('should generate keccak proof', async () => {
    const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });
    await sdk.generateKeccakProof({ x: 1 });
    expect(generateProof).toBeCalledWith('keccak', { x: 1 }, sdk);
  });
});

describe('generateApeProof()', () => {
  it('should generate ape proof', async () => {
    const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });
    await sdk.generateApeProof(
      { 
        block_number: 1, 
        token_id: 1, 
        wallet_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' 
      }
    );

    expect(generateProof).toBeCalledWith('is_ape_owner', { 
      chain_id: mainnet.id, 
      block_number: 1, 
      token_id: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
      ], 
      wallet_address: [
        0xd8, 0xdA, 0x6B, 0xF2, 0x69, 0x64, 0xaF, 0x9D, 0x7e, 0xEd, 
        0x9e, 0x03, 0xE5, 0x34, 0x15, 0xD3, 0x7a, 0xA9, 0x60, 0x45
      ]
    }, sdk);
  });

  it('should throw an error if address is invalid', async () => {
    try {
      const sdk = new SDK({ chainName: 'mainnet', rpcUrl: 'https://rpc.url' });
      await sdk.generateApeProof({ block_number: 1, token_id: 1, wallet_address: "0xInvalid" });
    } catch (error) {
      expect((error as Error).message).to.include('Address "0xInvalid" is invalid.');
    }
  });
});

