import { Vec } from '@polkadot/types';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import { Canvas } from '../pages/paint/paint';
import pako from 'pako';

export const canvas2Hex = (registry: any, obj: Canvas) => {
  const vector = new Vec(
    registry,
    registry.createClass('[u8; 160]'),
    obj.map((x) => {
      return Uint8Array.from(x);
    })
  );
  const deflate = pako.deflate(vector.toU8a());

  return window.btoa(u8aToHex(deflate));
};

export const hex2Canvas = (registry: any, encode: string) => {
  try {
    const hex = window.atob(encode);

    const inflate = pako.inflate(hexToU8a(hex));

    return registry
      .createType('Vec<[u8; 160]>', u8aToHex(inflate))
      .toArray()
      .map((x: any) => {
        return [...x];
      });
  } catch (error) {
    console.log(error);

    return null;
  }
};
