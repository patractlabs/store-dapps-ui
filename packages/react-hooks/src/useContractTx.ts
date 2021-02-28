import { useAccount, useApi, useToast } from '@patract/react-hooks';
import { getSigner, handleTxResults } from '@patract/utils';
import { ContractPromise } from '@polkadot/api-contract';
import { useCallback, useState } from 'react';

export type SignMessageFields = any[];

export type ContractTxProps = {
  contract: ContractPromise;
  method: string;
  title: string;
};

export const useContractTx = ({ title, contract, method }: ContractTxProps) => {
  const toast = useToast({
    title
  });

  const { api } = useApi();

  const [isLoading, setIsLoading] = useState(false);

  const { currentAccount } = useAccount();

  const queryEstimatedWeight = useCallback(
    async (fields: any[], value?: string) => {
      return contract.query[method](currentAccount, { gasLimit: -1, value: value || '0' }, ...fields).then(
        ({ gasConsumed, result }) => {
          return result.isOk ? gasConsumed : null;
        }
      );
    },
    [contract, currentAccount, method]
  );

  const excute = useCallback(
    async (fields: any[], value?: string) => {
      if (!currentAccount) {
        toast({
          status: 'error',
          description: 'No Account'
        });
        throw 'No Account';
      }

      setIsLoading(true);

      let toastId: any;

      try {
        const estimatedGas = await queryEstimatedWeight(fields, value);

        const tx = contract.tx[method](
          {
            gasLimit: estimatedGas?.toBn() || '400000000000',
            value: value || 0
          },
          ...fields
        );

        const signer = await getSigner(api.registry, currentAccount);

        await tx.signAsync(currentAccount, { signer });

        toastId = toast({
          status: 'info',
          description: 'Ready...',
          duration: null
        }) as string;

        return new Promise(async (resolve, reject) => {
          try {
            const unsubscribe = await tx.send(
              handleTxResults(
                'send',
                {
                  txFailedCb: (r) => {
                    toast.update(toastId, {
                      status: 'error',
                      description: r.find(({ status }) => status === 'error')?.message,
                      duration: 10000
                    });
                    setIsLoading(false);
                    reject(r);
                  },
                  txSuccessCb: (r) => {
                    toast.update(toastId, {
                      status: 'success',
                      description: r.find(({ status }) => status === 'success')?.message,
                      duration: 5000
                    });

                    setIsLoading(false);
                    resolve(undefined);
                  }
                },
                (): void => {
                  setIsLoading(false);
                  unsubscribe();
                }
              )
            );
          } catch (error) {
            toast.update(toastId, {
              status: 'error',
              description: error?.message,
              duration: 10000
            });
            setIsLoading(false);
            reject(error);
          }
        });
      } catch (error) {
        console.error(error);
        toastId && toast.close(toastId);
        toast({
          status: 'error',
          description: error?.message
        });
        setIsLoading(false);
        throw error;
      }
    },
    [queryEstimatedWeight, api, contract, method, currentAccount]
  );

  return {
    isLoading,
    excute
  };
};
