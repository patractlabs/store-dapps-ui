import {
  Button,
  Container,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalOverlay,
  SimpleGrid
} from '@chakra-ui/react';
import { InputNumberController, InputTextController } from '@patract/ui-components';

import React, { useRef } from 'react';
import { useForm, useController, UseControllerProps } from 'react-hook-form';
import { TokenType, TokenTypesField } from './token-types-field';

export type CreateAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
};

export const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ isOpen, onClose }) => {
  const { control, errors, handleSubmit } = useForm({
    defaultValues: { tokenType: TokenType.erc20_1, tokenName: '', tokenSymbol: '', tokenPrecision: '', tokenSupply: '' }
  });

  const deploy = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Modal motionPreset="none" variant='common' isOpen={isOpen} autoFocus={false} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='3xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Add Token</ModalHeader>
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
                  定义代币的小数位数。接受0-18个数字。18是最常见的做法。
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
              <Button width='full' size='lg' colorScheme='pink' onClick={deploy}>
                发币
              </Button>
            </FormControl>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
