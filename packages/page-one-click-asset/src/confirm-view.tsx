import AccountSigner from '@patract/react-components/signer/signers/account-signer';
import { useApi } from '@patract/react-hooks';
import {
  Box,
  Button,
  Flex,
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  SimpleGrid,
  Stack,
  Divider,
  InputAmountController,
  InputNumberController,
  FormLabel
} from '@patract/ui-components';
import { handleTxResults } from '@patract/utils';
import { BlueprintPromise } from '@polkadot/api-contract';
import { keyring } from '@polkadot/ui-keyring';
import React, { useRef, useState } from 'react';
import type { FieldValues } from './create-asset-modal';
import { getTokenAbi, getTokenTypeName } from './token-types';
import { useForm } from 'react-hook-form';
import { useToast } from '@patract/react-hooks';
import { parseAmount, formatAmount } from '@patract/utils';

type ConfirmViewProps = {
  values: FieldValues;
  resetView: () => void;
  onClose: () => void;
};

type ConfirmFieldValues = {
  value: string;
  gasLimit: string;
};

export const ConfirmView: React.FC<ConfirmViewProps> = ({ values, resetView, onClose }) => {
  const { control, errors, handleSubmit } = useForm<ConfirmFieldValues>({
    defaultValues: { value: '10.0', gasLimit: '200000000000' }
  });

  const { api } = useApi();

  const toast = useToast({
    title: 'Create Asset'
  });

  const [isLoading, setIsLoading] = useState(false);

  const confirmDeploy = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const value = parseAmount(data.value);
      const gasLimit = data.gasLimit;

      const abi = getTokenAbi(values.tokenType);

      const blueprint = new BlueprintPromise(api, abi, abi.source.hash);

      const tx = blueprint.tx['erc20,new'](
        {
          gasLimit,
          value
        },
        values.tokenSupply,
        values.tokenSymbol,
        values.tokenName,
        values.tokenDecimals
      );

      const signer = new AccountSigner(
        api.registry,
        keyring.getPair('3gGPnhZnwLXxX9nZfLY2moFdjLvBMVDVMbqRMTKZPbkXQuNA')
      );

      await tx.signAsync('3gGPnhZnwLXxX9nZfLY2moFdjLvBMVDVMbqRMTKZPbkXQuNA', { signer: signer });

      const toastId = toast({
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
            },
            txSuccessCb: (r) => {
              toast.update(toastId, {
                status: 'success',
                description: r.find(({ status }) => status === 'success')?.message,
                duration: 5000
              });
              onClose();
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
      toast({
        status: 'error',
        description: error?.message
      });
      setIsLoading(false);
    }
  });

  if (!values) return null;

  return (
    <ModalContent maxW='xl' border='1px' borderColor='gray.200' borderRadius='20px'>
      <ModalHeader>Confirm</ModalHeader>
      <ModalCloseButton />
      <ModalBody padding={8}>
        <SimpleGrid spacing='4'>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Value</FormLabel>
            <InputAmountController control={control} name='value' error={errors.value} rules={{ required: true }} />
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>GasLimit</FormLabel>
            <InputNumberController
              control={control}
              name='gasLimit'
              error={errors.gasLimit}
              rules={{ required: true, pattern: '^[0-9]*$' }}
            />
          </FormControl>
        </SimpleGrid>
        <Divider my='4' />
        <SimpleGrid mb='4'>
          <Flex justifyContent='space-between'>
            <Box color='gray.500'>Token Type</Box>
            <Box fontWeight='medium'>{getTokenTypeName(values.tokenType)}</Box>
          </Flex>
          <Flex justifyContent='space-between'>
            <Box color='gray.500'>Token Name</Box>
            <Box fontWeight='medium'>{values.tokenName}</Box>
          </Flex>
          <Flex justifyContent='space-between'>
            <Box color='gray.500'>Token Symbol</Box>
            <Box fontWeight='medium'>{values.tokenSymbol}</Box>
          </Flex>
          <Flex justifyContent='space-between'>
            <Box color='gray.500'>Token Precision</Box>
            <Box fontWeight='medium'>{values.tokenDecimals}</Box>
          </Flex>
          <Flex justifyContent='space-between'>
            <Box color='gray.500'>Initial Supply</Box>
            <Box fontWeight='medium'>{values.tokenSupply}</Box>
          </Flex>
        </SimpleGrid>
        <FormControl>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button colorScheme='blue' variant='outline' onClick={resetView} isDisabled={isLoading}>
              Prev
            </Button>
            <Button colorScheme='blue' onClick={confirmDeploy} isLoading={isLoading}>
              Confirm
            </Button>
          </Stack>
        </FormControl>
      </ModalBody>
    </ModalContent>
  );
};