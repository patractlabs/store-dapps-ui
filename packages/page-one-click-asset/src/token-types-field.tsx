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
                在合约部署时创建总供应，使供应量固定不变，永不增发。
              </FormHelperText>
            </Flex>
            <Flex w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <Radio value={TokenType.erc20_2}>{getTokenTypeName(TokenType.erc20_2)}</Radio>
              <FormHelperText maxW='2xs' mt='0' color='gray.500'>
                初始供应量是在合同部署时创建的，以后只有你有权限添加更多代币。
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
