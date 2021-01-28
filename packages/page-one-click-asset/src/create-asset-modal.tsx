import { useToast } from '@patract/react-hooks';
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
import { Abi } from '@polkadot/api-contract';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ConfirmView } from './confirm-view';
import { getTokenAbi, TokenType } from './token-types';
import { TokenTypesField } from './token-types-field';

export type CreateAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
};

enum ModalView {
  create = 'create',
  confirm = 'confirm'
}

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

  const [modalView, setModalView] = useState<ModalView>(ModalView.create);
  const [confirmValues, setConfirmValues] = useState<FieldValues | null>(null);
  const toast = useToast();

  const deploy = handleSubmit((data) => {
    try {
      const abi = new Abi(getTokenAbi(data.tokenType));

      abi.constructors[0].toU8a([data.tokenSupply, data.tokenSymbol, data.tokenName, data.tokenDecimals]);

      setConfirmValues(data);
      setModalView(ModalView.confirm);
    } catch (error) {
      toast({
        title: 'Create Asset',
        description: error?.message,
        status: 'error'
      });
      setConfirmValues(null);
    }
  });

  const resetView = () => {
    setModalView(ModalView.create);
    reset();
    setConfirmValues(null);
  };

  const handleClose = () => {
    resetView();
    onClose();
  };

  return (
    <Modal motionPreset='none' variant='common' isOpen={isOpen} autoFocus={false} onClose={handleClose}>
      <ModalOverlay />
      {modalView === ModalView.create ? (
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
                <Button width='full' size='lg' colorScheme='blue' onClick={deploy}>
                  Issue
                </Button>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      ) : modalView === ModalView.confirm && confirmValues ? (
        <ConfirmView values={confirmValues} resetView={resetView} onClose={handleClose} />
      ) : null}
    </Modal>
  );
};
