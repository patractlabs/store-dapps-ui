import { Flex, FormHelperText, Radio, RadioGroup, VStack } from '@chakra-ui/react';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TokenType, getTokenTypeName } from './token-types';

type TokenTypesFieldProps = {
  control: Control;
  name: string;
};

export const TokenTypesField: React.FC<TokenTypesFieldProps> = ({ control, name }) => {
  return (
    <Controller
      render={({ value, onChange, ref }) => (
        <RadioGroup value={value} onChange={onChange} mt='2' ref={ref}>
          <VStack spacing='24px' alignItems='flex-start'>
            <Flex w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <Radio value={TokenType.erc20_1}>{getTokenTypeName(TokenType.erc20_1)}</Radio>
              <FormHelperText maxW='2xs' mt='0' color='gray.500'>
                Create a gross supply when the contract is deployed so that the supply amount is constant and never increases.
              </FormHelperText>
            </Flex>
            <Flex w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <Radio value={TokenType.erc20_2}>{getTokenTypeName(TokenType.erc20_2)}</Radio>
              <FormHelperText maxW='2xs' mt='0' color='gray.500'>
                The initial supply is created when the contract is deployed and only you have the permission to add more tokens later.
              </FormHelperText>
            </Flex>
          </VStack>
        </RadioGroup>
      )}
      name={name}
      control={control}
      rules={{ required: true }}
    />
  );
};
