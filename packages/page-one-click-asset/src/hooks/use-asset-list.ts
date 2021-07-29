import { useApi } from '@patract/react-hooks';
import { trait } from '@patract/utils';
import { ContractPromise } from '@polkadot/api-contract';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { getTokenAbi } from '../token-types';

type AssetListItem = {
  id: string;
  codeHash: string;
  address: string;
  signer: string;
  tokenDecimals?: string;
  tokenSymbol?: string;
  totalSupply?: string;
  tokenName?: string;
};

export const useAssetList = (
  contractList: {
    id: string;
    signer: string;
    address: string;
    codeHash: string;
  }[]
) => {
  const [count, forceUpdate] = useReducer((x) => x + 1, 0);
  const { isApiReady, api } = useApi();
  const [result, setResult] = useState<AssetListItem[] | undefined>();
  const [loading, setLoading] = useState(false);

  const query = useCallback(async () => {
    if (!isApiReady || !contractList) return;

    return Promise.all(
      contractList.map(({ id, signer, address, codeHash }) => {
        const contract = new ContractPromise(api, getTokenAbi(codeHash), address);

        return Promise.all([
          contract.query[`${trait}tokenDecimals`](signer, {}).then((data) => {
            return data.output?.toString();
          }),
          contract.query[`${trait}tokenSymbol`](signer, {}).then((data) => {
            return data.output?.toString();
          }),
          contract.query[`${trait}totalSupply`](signer, {}).then((data) => {
            return data.output?.toString();
          }),
          contract.query[`${trait}tokenName`](signer, {}).then((data) => {
            return data.output?.toString();
          })
        ]).then(([tokenDecimals, tokenSymbol, totalSupply, tokenName]) => {
          return {
            id,
            codeHash,
            address,
            signer,
            tokenDecimals,
            tokenSymbol,
            totalSupply,
            tokenName
          };
        });
      })
    ).finally(() => {
      setLoading(false);
    });
  }, [isApiReady, api, contractList, count]);

  useEffect(() => {
    setLoading(true);

    query().then((data) => {
      setResult(data);
    });
  }, [query]);

  return {
    data: result,
    loading,
    forceUpdate
  };
};
