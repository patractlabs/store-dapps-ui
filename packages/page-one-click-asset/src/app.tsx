import React, { useMemo } from 'react';
import { ThemeProvider, InputNumberController, InputTextController } from '@patract/ui-components';
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  VStack,
  Radio,
  FormHelperText,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  Container,
  SimpleGrid,
  Flex,
  Button,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';

import { useForm, Controller } from 'react-hook-form';

export const App = () => {
  const { register, watch, control, errors, handleSubmit } = useForm({
    defaultValues: { tokenType: 'erc20-1', tokenName: '', tokenSymbol: '', tokenPrecision: '', tokenSupply: '' }
  });

  const tokenType = watch('tokenType');
  const isERC777 = useMemo(() => tokenType === 'erc777', [tokenType]);

  const deploy = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <ThemeProvider>
      <Container maxW='3xl' mt='12' border='1px' padding='4' borderColor='gray.200' borderRadius='20px'>
        <SimpleGrid column={1} spacing='8'>
          <Controller
            render={({ value, onChange }) => (
              <FormControl as='fieldset'>
                <FormLabel as='legend'>代币类型</FormLabel>
                <RadioGroup value={value} onChange={onChange} mt='2' ref={register}>
                  <VStack spacing='24px' alignItems='flex-start'>
                    <Flex w='100%' justifyContent='space-between' height='6' alignItems='center'>
                      <Radio value='erc20-1'>固定总量ERC20代币</Radio>
                      <FormHelperText maxW='xs' mt='0'>
                        在合约部署时创建总供应，使供应量固定不变，永不增发。了解更多固定总量ERC20代币
                      </FormHelperText>
                    </Flex>
                    <Flex w='100%' justifyContent='space-between' height='6' alignItems='center'>
                      <Radio value='erc20-2'>可增发ERC20代币</Radio>
                      <FormHelperText maxW='xs' mt='0'>
                        初始供应量是在合同部署时创建的，以后只有你有权限添加更多代币。了解更多可增发ERC20代币
                      </FormHelperText>
                    </Flex>
                    <Flex w='100%' justifyContent='space-between' height='6' alignItems='center'>
                      <Radio value='erc777'>ERC-777代币</Radio>
                      <FormHelperText maxW='xs' mt='0'>
                        与ERC-20标准代币类似，具有更高级功能，可以更方便的管理代币转账。了解更多ERC-777代币
                      </FormHelperText>
                    </Flex>
                  </VStack>
                </RadioGroup>
              </FormControl>
            )}
            name='tokenType'
            control={control}
            rules={{ required: true }}
          />
          <FormControl as='fieldset'>
            <FormLabel as='legend'>代币名称</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputTextController control={control} maxWidth='2xs' name='tokenName' rules={{ required: true }} />
              <FormHelperText maxW='xs' mt='0' color='red.500'>
                代币的名称。1-28个符号。可接受英文字母、数字、字符、空格和连字符。
              </FormHelperText>
            </Flex>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>代币符号</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputTextController control={control} maxWidth='2xs' name='tokenSymbol' rules={{ required: true }} />
              <FormHelperText maxW='xs' mt='0'>
                1-10个字符（例如ETH、BTC、BAT等）。不能包括空格，可以包括英文字母、数字字符等。
              </FormHelperText>
            </Flex>
          </FormControl>
          {!isERC777 && (
            <FormControl as='fieldset'>
              <FormLabel as='legend'>小数位</FormLabel>
              <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
                <InputNumberController control={control} maxWidth='2xs' name='tokenPrecision' pattern='^[0-9]{0,2}$' />
                <FormHelperText maxW='xs' mt='0'>
                  定义代币的小数位数。接受0-18个数字。18是最常见的做法。
                </FormHelperText>
              </Flex>
            </FormControl>
          )}
          <FormControl as='fieldset'>
            <FormLabel as='legend'>初始供应量</FormLabel>
            <Flex mt='4' w='100%' justifyContent='space-between' height='6' alignItems='center'>
              <InputNumberController control={control} maxWidth='2xs' name='tokenSupply' pattern='^[0-9]{0,16}$' />

              <FormHelperText maxW='xs' mt='0'>
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
