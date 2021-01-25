import AccountSigner from '@patract/react-components/signer/signers/account-signer';
import { useApi, useToast, useAccount } from '@patract/react-hooks';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  InputAmountController,
  InputNumberController,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text
} from '@patract/ui-components';
import { handleTxResults, parseAmount, getSigner } from '@patract/utils';
import { ContractPromise } from '@polkadot/api-contract';
import { keyring } from '@polkadot/ui-keyring';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type ConfirmFieldValues = {
  value: string;
  gasLimit: string;
};

export type SignMessageFields = {
  label: string;
  content: string;
  value?: string;
}[];

export type SignMessageModalProps = {
  contract: ContractPromise;
  method: string;
  fields: SignMessageFields;
  onBack: () => void;
  onClose: () => void;
  title: string;
  isOpen: boolean;
};

export const SignMessageModal: React.FC<SignMessageModalProps> = ({
  isOpen,
  contract,
  method,
  title,
  fields,
  onBack,
  onClose
}) => {
  const { control, errors, handleSubmit } = useForm<ConfirmFieldValues>({
    defaultValues: { value: '0', gasLimit: '200000000000' }
  });

  const { api } = useApi();
  const { currentAccount } = useAccount();

  const toast = useToast({
    title
  });

  const [isLoading, setIsLoading] = useState(false);

  const confirm = handleSubmit(async (data) => {
    setIsLoading(true);

    let toastId: any;
    
    try {
      const value = parseAmount(data.value);
      const gasLimit = data.gasLimit;

      const tx = contract.tx[method](
        {
          gasLimit,
          value
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
      toastId && toast.close(toastId);
      toast({
        status: 'error',
        description: error?.message
      });
      setIsLoading(false);
    }
  });

  if (!fields) return null;

  return (
    <Modal motionPreset='none' variant='common' isOpen={isOpen} autoFocus={false} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Confirm</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={8}>
          <SimpleGrid spacing='4'>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Account</FormLabel>
              <Text>{currentAccount}</Text>
            </FormControl>
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
            {fields?.map(({ label, content }) => (
              <Flex key={label} justifyContent='space-between'>
                <Box color='gray.500'>{label}</Box>
                <Box fontWeight='medium'>{content}</Box>
              </Flex>
            ))}
          </SimpleGrid>
          <FormControl>
            <Stack direction='row' spacing={4} justifyContent='flex-end'>
              {onBack && (
                <Button colorScheme='blue' variant='outline' onClick={onBack} isDisabled={isLoading}>
                  Prev
                </Button>
              )}
              <Button colorScheme='blue' onClick={confirm} isLoading={isLoading}>
                Confirm
              </Button>
            </Stack>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
