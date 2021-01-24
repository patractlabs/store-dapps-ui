import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  StatGroup,
  Box
} from '@patract/ui-components';
import { InputNumberController, InputTextController } from '@patract/ui-components';
import React, { useMemo, useState } from 'react';
import { BlueprintPromise, Abi } from '@polkadot/api-contract';
import { useForm } from 'react-hook-form';
import { TokenType, TokenTypesField, TokenTypeName } from './token-types-field';
import { useApi, useModal } from '@patract/react-hooks';
import Erc20fixed from './contracts/erc20fixed.json';
import Erc20mintable from './contracts/erc20mintable.json';

export type CreateAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
};

enum ModalView {
  create = 'create',
  confirm = 'confirm'
}

type FieldValues = {
  tokenType: TokenType;
  tokenName: string;
  tokenSymbol: string;
  tokenPrecision: string;
  tokenSupply: string;
};

const AbiJSONS = {
  [TokenType.erc20_1]: Erc20fixed,
  [TokenType.erc20_2]: Erc20mintable
};

export const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ isOpen, onClose }) => {
  const { control, errors, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { tokenType: TokenType.erc20_1, tokenName: '', tokenSymbol: '', tokenPrecision: '', tokenSupply: '' }
  });

  const [modalView, setModalView] = useState<ModalView>(ModalView.create);
  const [confirmValues, setConfirmValues] = useState<FieldValues | null>(null);

  const { isApiReady, api } = useApi();

  const deploy = handleSubmit((data) => {
    setModalView(ModalView.confirm);

    const abi = new Abi(AbiJSONS[data.tokenType]);

    abi.constructors[0].toU8a([data.tokenSupply, data.tokenSymbol, data.tokenName, data.tokenPrecision]);

    setConfirmValues(data);
  });

  const resetView = () => {
    setModalView(ModalView.create);
    reset();
    setConfirmValues(null);
  };

  const confirmDeploy = () => {
    if (!confirmValues) {
      resetView();
      return;
    }

    const abiJSON = AbiJSONS[confirmValues.tokenType];

    const blueprint = new BlueprintPromise(api, abiJSON, abiJSON.source.hash);

    const data = blueprint.tx['erc20,new'](
      {
        gasLimit: '10000000000000',
        value: '10000000000000'
      },
      confirmValues.tokenSupply,
      confirmValues.tokenSymbol,
      confirmValues.tokenName,
      confirmValues.tokenPrecision
    ).signAndSend('3gGPnhZnwLXxX9nZfLY2moFdjLvBMVDVMbqRMTKZPbkXQuNA', (result) => {
      console.log(result);
    });
  };

  const handleClose = () => {
    resetView();
    onClose();
  };

  return (
    <Modal motionPreset='none' variant='common' isOpen={isOpen} autoFocus={false} onClose={handleClose}>
      <ModalOverlay />
      {modalView === ModalView.create ? (
        <ModalContent maxW='3xl' border='1px' borderColor='gray.200' borderRadius='20px'>
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
                  <FormHelperText maxW='xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                    代币的名称。1-28 个符号。可接受英文字母、数字、字符、空格和连字符。
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
                  <FormHelperText maxW='xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                    1-10个字符（例如 ETH、BTC、BAT 等）。不能包括空格，可以包括英文字母、数字字符等。
                  </FormHelperText>
                </Flex>
              </FormControl>
              <FormControl as='fieldset'>
                <FormLabel as='legend'>Token Precision</FormLabel>
                <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
                  <InputNumberController
                    control={control}
                    maxWidth='2xs'
                    name='tokenPrecision'
                    pattern='^[0-9]{0,2}$'
                    rules={{ required: true }}
                  />
                  <FormHelperText maxW='xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                    定义代币的小数位数。接受0-18个数字。
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
                  <FormHelperText maxW='xs' mt='0' color={errors.tokenName ? 'red.500' : 'gray.500'}>
                    初始量需要生成的代币数量,最小数量是1, 最大是1000000000000000.
                  </FormHelperText>
                </Flex>
              </FormControl>
              <FormControl>
                <Button width='full' size='lg' colorScheme='blue' onClick={deploy}>
                  发币
                </Button>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      ) : modalView === ModalView.confirm ? (
        <ModalContent maxW='md' border='1px' borderColor='gray.200' borderRadius='20px'>
          <ModalHeader>Confirm</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={8}>
            <SimpleGrid mb='4'>
              <Flex justifyContent='space-between'>
                <Box color='gray.500'>Token Type</Box>
                <Box fontWeight='medium'>{confirmValues && TokenTypeName[confirmValues.tokenType]}</Box>
              </Flex>
              <Flex justifyContent='space-between'>
                <Box color='gray.500'>Token Name</Box>
                <Box fontWeight='medium'>{confirmValues?.tokenName}</Box>
              </Flex>
              <Flex justifyContent='space-between'>
                <Box color='gray.500'>Token Symbol</Box>
                <Box fontWeight='medium'>{confirmValues?.tokenSymbol}</Box>
              </Flex>
              <Flex justifyContent='space-between'>
                <Box color='gray.500'>Token Precision</Box>
                <Box fontWeight='medium'>{confirmValues?.tokenPrecision}</Box>
              </Flex>
              <Flex justifyContent='space-between'>
                <Box color='gray.500'>Initial Supply</Box>
                <Box fontWeight='medium'>{confirmValues?.tokenSupply}</Box>
              </Flex>
            </SimpleGrid>
            <FormControl>
              <Stack direction='row' spacing={4} justifyContent='flex-end'>
                <Button colorScheme='blue' variant='outline' onClick={resetView}>
                  Prev
                </Button>
                <Button colorScheme='blue' onClick={confirmDeploy}>
                  Confirm
                </Button>
              </Stack>
            </FormControl>
          </ModalBody>
        </ModalContent>
      ) : null}
    </Modal>
  );
};
