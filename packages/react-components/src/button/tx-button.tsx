import { useAccount, useApi, useToast } from '@patract/react-hooks';
import { Button } from '@patract/ui-components';
import { getSigner, handleTxResults } from '@patract/utils';
import { ContractPromise } from '@polkadot/api-contract';
import React, { useCallback, useState } from 'react';

export type SignMessageFields = any[];

export type TxButtonProps = {
  contract: ContractPromise;
  method: string;
  fields: SignMessageFields;
  title: string;
  value?: string;
  onSubmit?: () => void;
  onError?: () => void;
} & React.ComponentType<typeof Button>;

export const TxButton: React.FC<TxButtonProps> = ({
  contract,
  onSubmit,
  value,
  onError,
  method,
  title,
  fields,
  children,
  ...rest
}) => {
  const { api } = useApi();
  const { currentAccount } = useAccount();

  const toast = useToast({
    title
  });

  const [isLoading, setIsLoading] = useState(false);

  const deploy = async () => {
    setIsLoading(true);

    let toastId: any;

    try {
      const estimatedGas = await queryEstimatedWeight();

      const tx = contract.tx[method](
        {
          gasLimit: estimatedGas?.toBn() || '400000000',
          value: value || 0
        },
        ...fields.map(({ value, content }) => value ?? content)
      );

      const signer = await getSigner(api.registry, currentAccount);

      await tx.signAsync(currentAccount, { signer });

      toastId = toast({
        status: 'info',
        description: 'Ready...',
        duration: null
      }) as string;

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
              onError && onError();
            },
            txSuccessCb: (r) => {
              toast.update(toastId, {
                status: 'success',
                description: r.find(({ status }) => status === 'success')?.message,
                duration: 5000
              });
              onSubmit && onSubmit();
            }
          },
          (): void => {
            setIsLoading(false);
            unsubscribe();
          }
        )
      );
    } catch (error) {
      console.error(error);
      toastId && toast.close(toastId);
      toast({
        status: 'error',
        description: error?.message
      });
      setIsLoading(false);
      onError && onError();
    }
  };

  const queryEstimatedWeight = useCallback(() => {
    return contract.query[method](
      currentAccount,
      { gasLimit: -1, value: value || '0' },
      ...fields.map(({ value, content }) => value ?? content)
    ).then(({ gasConsumed, result }) => {
      return result.isOk ? gasConsumed : null;
    });
  }, [contract, currentAccount, method, fields, value]);

  return (
    <Button isLoading={isLoading} colorScheme='blue' onClick={deploy} {...rest}>
      {children}
    </Button>
  );
};
