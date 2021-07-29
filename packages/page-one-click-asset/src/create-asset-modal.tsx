import { useAccount, useApi, useToast } from '@patract/react-hooks';
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  InputNumberController,
  InputTextController,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid
} from '@patract/ui-components';
import { getSigner, handleTxResults, parseAmount, trait } from '@patract/utils';
import { BlueprintPromise } from '@polkadot/api-contract';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getTokenAbi, TokenType } from './token-types';
import { TokenTypesField } from './token-types-field';

export type CreateAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
};

export type FieldValues = {
  tokenType: TokenType;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
  tokenSupply: string;
};

export const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ isOpen, onClose }) => {
  const { control, errors, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { tokenType: TokenType.erc20_1, tokenName: '', tokenSymbol: '', tokenDecimals: '', tokenSupply: '' }
  });

  const { currentAccount } = useAccount();
  const toast = useToast({
    title: 'Create Asset'
  });
  const { api } = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const deploy = handleSubmit(async (data) => {
    if (!currentAccount) {
      toast({
        status: 'error',
        description: 'No Account'
      });
      throw 'No Account';
    }

    let toastId: any;

    try {
      setIsLoading(true);
      const abi = getTokenAbi(data.tokenType);

      const blueprint = new BlueprintPromise(api, abi, abi.source.hash);

      const tx = blueprint.tx[`${trait}new`](
        {
          gasLimit: '400000000000',
          value: 0
        },
        parseAmount(data.tokenSupply, Number(data.tokenDecimals)),
        data.tokenName,
        data.tokenSymbol,
        data.tokenDecimals
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
      toastId && toast.close(toastId);
      toast({
        status: 'error',
        description: error?.message
      });
      setIsLoading(false);
    }
  });

  const resetView = () => {
    reset();
  };

  const handleClose = () => {
    resetView();
    onClose();
  };

  return (
    <Modal motionPreset='none' variant='common' isOpen={isOpen} autoFocus={false} onClose={handleClose}>
      <ModalOverlay />

      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Create Asset</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={8}>
          <SimpleGrid column={1} spacing='8'>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Token Type</FormLabel>
              <TokenTypesField control={control} name='tokenType' />
            </FormControl>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Token Name</FormLabel>
              <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
                <InputTextController
                  control={control}
                  maxWidth='2xs'
                  name='tokenName'
                  error={errors.tokenName}
                  rules={{ required: true, pattern: /^\w*$/ }}
                />
                <FormHelperText maxW='2xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                  Token name. 1-28 symbols. Letters, numbers, characters, spaces and hyphens are acceptable.
                </FormHelperText>
              </Flex>
            </FormControl>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Token Symbol</FormLabel>
              <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
                <InputTextController
                  control={control}
                  maxWidth='2xs'
                  name='tokenSymbol'
                  error={errors.tokenSymbol}
                  rules={{ required: true, pattern: /^\w*$/ }}
                />
                <FormHelperText maxW='2xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                  1-10 characters (e.g. ETH, BTC, BAT, etc.). Cannot include spaces, can include alphabetic, numeric
                  characters etc.
                </FormHelperText>
              </Flex>
            </FormControl>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Token Precision</FormLabel>
              <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
                <InputNumberController
                  control={control}
                  maxWidth='2xs'
                  name='tokenDecimals'
                  pattern='^[0-9]{0,2}$'
                  rules={{ required: true }}
                />
                <FormHelperText maxW='2xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                  Defines the number of decimal places for the tokens. Accepts numbers from 0-18.
                </FormHelperText>
              </Flex>
            </FormControl>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Initial Supply</FormLabel>
              <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
                <InputNumberController
                  control={control}
                  maxWidth='2xs'
                  name='tokenSupply'
                  pattern='^[0-9]{0,16}$'
                  rules={{ required: true }}
                />
                <FormHelperText maxW='2xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                  Initial amount of tokens to be generated. Minimum is 1, maximum is 1,000,000,000,000,000.
                </FormHelperText>
              </Flex>
            </FormControl>
            <FormControl>
              <Button isLoading={isLoading} width='full' size='lg' colorScheme='blue' onClick={deploy}>
                Issue
              </Button>
            </FormControl>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
