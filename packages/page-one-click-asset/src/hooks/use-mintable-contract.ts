import { useApi } from '@patract/react-hooks';
import { abis } from '@patract/utils';
import { ContractPromise } from '@polkadot/api-contract';
import { useMemo } from 'react';

export const useMintableContract = (address: string) => {
  const { isApiReady, api } = useApi();

  return useMemo(() => {
    if (!isApiReady || !address) {
      throw new Error('Unexpected');
    }

    return {
      contract: new ContractPromise(api, abis.Erc20issue, address),
      abiJSON: abis.Erc20issue
    };
  }, [isApiReady, api, address]);
};
