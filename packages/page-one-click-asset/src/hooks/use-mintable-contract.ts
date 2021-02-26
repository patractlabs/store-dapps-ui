import { useApi } from '@patract/react-hooks';
import { ContractPromise } from '@polkadot/api-contract';
import { useMemo } from 'react';
import Erc20mintable from '@patract/utils/contracts/erc20_issue.json';

export const useMintableContract = (address: string) => {
  const { isApiReady, api } = useApi();

  return useMemo(() => {
    if (!isApiReady || !address) {
      throw new Error('Unexpected');
    }

    return {
      contract: new ContractPromise(api, Erc20mintable, address),
      abiJSON: Erc20mintable
    };
  }, [isApiReady, api, address]);
};
