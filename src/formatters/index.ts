import { getAddress } from "viem/utils";

export const addressToNoirFormat = (address: string) => {
  let addr = getAddress(address);

  const formattedAddress = getAddress(address)
    ?.replace("0x", "")
    ?.match(/.{1,2}/g)
    ?.map((x) => Number(`0x${x}`));

  return formattedAddress || [];
};

export const numberToNoirBytes32 = (num: number) => {
  return num
    .toString(16)
    .padStart(32, "0")
    .split("")
    .map((el) => parseInt(el, 16));
};
