import { Abi } from '@polkadot/api-contract';
import { AnyJson } from '@polkadot/types/types';

export const checkContractParams = (abiJSON: AnyJson, message: string, params: any[]) => {
  const abi = new Abi(abiJSON);

  const messgae = abi.findMessage(message);

  if (!message) {
    throw new Error('Unexpected');
  }

  messgae.toU8a(params);

  return true;
};
