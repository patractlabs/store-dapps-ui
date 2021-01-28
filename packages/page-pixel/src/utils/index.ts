import { Vec } from '@polkadot/types';
import { Canvas } from '../pages/paint';

export const canvas2Hex = (registry: any, obj: Canvas) => {
  const vector = new Vec(
    registry,
    registry.createClass('[u8; 160]'),
    obj.map((x) => {
      return Uint8Array.from(x);
    })
  );
  return vector.toHex();
};

export const hex2Canvas = (registry: any, hex: string) => {
  const x = registry
    .createType('Vec<[u8; 160]>', hex)
    .toArray()
    .map((x: any) => {
      return [...x];
    });
  return x;
};
