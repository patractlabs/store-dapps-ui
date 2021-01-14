import React from 'react';
import { ThemeProvider } from '@patract/ui-components';
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
  Flex
} from '@chakra-ui/react';

function App() {
  return (
    <ThemeProvider>
      <Container maxW='3xl' mt='12' border='1px' padding='4' borderColor='gray.200' borderRadius='10px'>
        <SimpleGrid column={1} spacing='4'>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>代币类型</FormLabel>
            <RadioGroup defaultValue='Itachi'>
              <VStack spacing='24px' alignItems='flex-start'>
                <Flex w="100%" justifyContent='space-between' height='8' alignItems='center'>
                  <Radio value='erc20-1'>固定总量ERC20代币</Radio>
                  <FormHelperText maxW='md' mt='0'>
                    在合约部署时创建总供应，使供应量固定不变，永不增发。了解更多固定总量ERC20代币
                  </FormHelperText>
                </Flex>
                <Flex w="100%" justifyContent='space-between' height='8' alignItems='center'>
                  <Radio value='erc20-2'>可增发ERC20代币</Radio>
                  <FormHelperText maxW='md' mt='0'>
                    初始供应量是在合同部署时创建的，以后只有你有权限添加更多代币。了解更多可增发ERC20代币
                  </FormHelperText>
                </Flex>
                <Flex w="100%" justifyContent='space-between' height='8' alignItems='center'>
                  <Radio value='erc777'>ERC-777代币</Radio>
                  <FormHelperText maxW='md' mt='0'>
                    与ERC-20标准代币类似，具有更高级功能，可以更方便的管理代币转账。了解更多ERC-777代币
                  </FormHelperText>
                </Flex>
              </VStack>
            </RadioGroup>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Favorite Naruto Character</FormLabel>
            <Input />
            <FormHelperText>Select only if you're a fan.</FormHelperText>
          </FormControl>
        </SimpleGrid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
