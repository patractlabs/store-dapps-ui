import { api } from '@patract/react-components/api';
import { Abi } from '@polkadot/api-contract';
import type { AnyJson } from '@polkadot/types/types';
import { getAddressMeta } from './get-address-meta';

export function getContractAbi(address: string | null): Abi | null {
  if (!address) {
    return null;
  }

  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract && (JSON.parse(meta.contract.abi) as AnyJson);

    abi = new Abi(data, api.registry.getChainProperties());
  } catch (error) {
    console.error(error);
  }

  return abi || null;
}
