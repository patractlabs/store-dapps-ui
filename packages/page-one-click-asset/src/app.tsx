import { Button, Container, Flex, FormControl, FormHelperText, FormLabel, SimpleGrid } from '@chakra-ui/react';
import { InputNumberController, InputTextController, ThemeProvider } from '@patract/ui-components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TokenTypesField } from './token-types-field';

export const App = () => {
  const { control, errors, handleSubmit } = useForm({
    defaultValues: { tokenType: 'erc20-1', tokenName: '', tokenSymbol: '', tokenPrecision: '', tokenSupply: '' }
  });

  const deploy = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <ThemeProvider>
      <Container maxW='3xl' mt='12' border='1px' padding='4' borderColor='gray.200' borderRadius='20px'>
        <SimpleGrid column={1} spacing='8'>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>代币类型</FormLabel>
            <TokenTypesField control={control} name='tokenType' />
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>代币名称</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputTextController
                control={control}
                maxWidth='2xs'
                name='tokenName'
                error={errors.tokenName}
                rules={{ required: true, pattern: /^\w*$/ }}
              />
              <FormHelperText maxW='xs' mt='0' color={errors.tokenName && 'red.500'}>
                代币的名称。1-28个符号。可接受英文字母、数字、字符、空格和连字符。
              </FormHelperText>
            </Flex>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>代币符号</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputTextController
                control={control}
                maxWidth='2xs'
                name='tokenSymbol'
                error={errors.tokenSymbol}
                rules={{ required: true, pattern: /^\w*$/ }}
              />
              <FormHelperText maxW='xs' mt='0' color={errors.tokenSymbol && 'red.500'}>
                1-10个字符（例如ETH、BTC、BAT等）。不能包括空格，可以包括英文字母、数字字符等。
              </FormHelperText>
            </Flex>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>小数位</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputNumberController
                control={control}
                maxWidth='2xs'
                name='tokenPrecision'
                pattern='^[0-9]{0,2}$'
                rules={{ required: true }}
              />
              <FormHelperText maxW='xs' mt='0' color={errors.tokenPrecision && 'red.500'}>
                定义代币的小数位数。接受0-18个数字。18是最常见的做法。
              </FormHelperText>
            </Flex>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>初始供应量</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputNumberController
                control={control}
                maxWidth='2xs'
                name='tokenSupply'
                pattern='^[0-9]{0,16}$'
                rules={{ required: true }}
              />
              <FormHelperText maxW='xs' mt='0' color={errors.tokenSupply && 'red.500'}>
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
      </Container>
    </ThemeProvider>
  );
};

export default App;
