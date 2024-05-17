import { it, describe, expect } from 'vitest';
import { addressToNoirFormat, numberToNoirBytes32 } from '../formatters';

describe('addressToNoirFormat()', () => {
  it("should convert address to noir format", () => {
    const converted = addressToNoirFormat('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    expect(converted).toStrictEqual([
      0xd8, 0xdA, 0x6B, 0xF2, 0x69, 0x64, 0xaF, 0x9D, 0x7e, 0xEd, 
      0x9e, 0x03, 0xE5, 0x34, 0x15, 0xD3, 0x7a, 0xA9, 0x60, 0x45
    ]);
  });

  it("should throw error if address is invalid", () => {
    try {
      addressToNoirFormat('0xInvalid12');
    } catch (error) {
      expect((error as Error).message).to.include('Address "0xInvalid12" is invalid.');
    }
  });
})

describe('numberToNoirBytes32()', () => {
  it("should convert number to noir bytes32", () => {
    const converted = numberToNoirBytes32(7);
    const expectedArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7];
    expect(converted).toStrictEqual(expectedArr)
  });

  it("should convert bigger number to noir bytes32", () => {
    const converted = numberToNoirBytes32(7777);
    const expectedArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 14, 6, 1];
    expect(converted).toStrictEqual(expectedArr)
  });   
});