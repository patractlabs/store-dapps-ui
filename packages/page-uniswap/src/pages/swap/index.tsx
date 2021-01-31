import React, { useState } from 'react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { FiRepeat } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { Box, Button, Center, Flex, FormControl, Text, Icon, PageLayout, PageMain } from '@patract/ui-components';
import Header from '../../components/header';
import InputSelect, { MenuOption } from '../../components/input-select';
import USDTIcon from '../../images/usdt.png';
import { handleInputChange } from 'react-select/src/utils';

const price = 0.1;

const Swap = () => {
  const [toValue, setToValue] = useState<string>('');
  const [toOption, setToOption] = useState<any>(null);
  const [fromValue, setFromValue] = useState<string>('');
  const [fromOption, setFromOption] = useState<any>(null);
  const [estimatedTo, setEstimatedTo] = useState<string | null>();
  const [estimatedFrom, setEstimatedFrom] = useState<string | null>();

  const swapFromTo = () => {};

  const submit = () => {};

  return (
    <PageLayout>
      <Header />
      <PageMain>
        <Center mt='10'>
          <Box
            maxW='2xl'
            width='2xl'
            background='white'
            border='1px solid'
            borderColor='gray.200'
            borderRadius='20px'
            p={[10, 20]}
          >
            <FormControl sx={{ mb: '24px' }}>
              <InputSelect
                defaultOptionIndex={0}
                value={toValue}
                option={toOption}
                onChangeOption={setToOption}
                onChangeValue={setToValue}
                label='From'
              />
            </FormControl>
            <Icon
              as={FiRepeat}
              onClick={swapFromTo}
              sx={{
                position: 'absolute',
                display: 'inline-block',
                padding: '4px',
                w: 7,
                h: 7,
                color: 'blue.500',
                transform: 'rotate(90deg)',
                borderRadius: '2px',
                mt: '-10px',
                cursor: 'pointer',
                zIndex: 'docked',
                mx: 'auto',
                left: 0,
                right: 0
              }}
            />
            <FormControl sx={{ mb: '16px' }}>
              <InputSelect
                defaultOptionIndex={1}
                value={fromValue}
                option={fromOption}
                onChangeOption={setFromOption}
                onChangeValue={setFromValue}
                label='To'
              />
            </FormControl>
            <Box
              sx={{
                border: '1px solid #ABB4D0',
                borderRadius: '4px',
                p: '10px 18px',
                mb: '24px'
              }}
            >
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Text sx={{ color: '#999999', display: 'inline-block' }}>Price</Text>
                <Center>
                  <Text sx={{ display: 'inline-block' }}>
                    {/* 722.224 {from_select.label} per {to_select.label} */}
                  </Text>
                  <Icon
                    as={FiRepeat}
                    w={5}
                    h={5}
                    sx={{ ml: '15px', color: 'brand.primary', cursor: 'pointer' }}
                    onClick={swapFromTo}
                  />
                </Center>
              </Flex>
            </Box>
            <FormControl>
              <Button width='full' size='lg' colorScheme='blue' onClick={submit}>
                Swap
              </Button>
            </FormControl>
          </Box>
        </Center>
      </PageMain>
    </PageLayout>
  );
};

export default Swap;
