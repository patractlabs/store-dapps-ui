import React from 'react';
import { Box, Button, Center, Flex, FormControl, Text, Icon } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { FiRepeat } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { PageLayout, PageMain } from '@patract/ui-components';
import Header from '../../components/header';
import InputSelect, { MenuOption } from '../../components/input-select';
import USDTIcon from '../../images/usdt.png';

const options: Array<MenuOption> = [
  { value: 'usdt', label: 'USDT', icon: USDTIcon, fullName: 'Tether', address: 'GAneP4k…fJEfs', balance: 0 },
  { value: 'eth', label: 'ETH', icon: USDTIcon, fullName: 'Ethereum', address: 'GAneP4k…fJEfs', balance: 150000.9912 }
];

const defaultValues = {
  from_input: '',
  from_select: options[0],
  to_input: '',
  to_select: options[1]
};

const Swap = () => {
  const { control, watch, setValue } = useForm({ defaultValues });
  let { from_select, to_select } = watch(['from_select', 'to_select']);

  const swapFromTo = () => {
    [from_select, to_select] = [to_select, from_select];
    setValue('from_select', from_select);
    setValue('to_select', to_select);
  };

  return (
    <PageLayout>
      <Header />
      <PageMain>
        <Box sx={{ bgColor: '#FFFFFF', borderRadius: '8px', p: '24px 0 150px', mt: '60px' }}>
          <Center>
            <Box
              sx={{
                position: 'relative',
                border: '1px solid #ABB4D0',
                bgColor: '#F9FAFB',
                borderRadius: '2px',
                p: '40px 80px'
              }}
            >
              <FormControl sx={{ mb: '24px' }}>
                <InputSelect
                  frontLabel='From'
                  options={options}
                  inputName='from_input'
                  selectName='from_select'
                  control={control}
                  watch={watch}
                  defaultValue=''
                  defaultOption={defaultValues.from_select}
                  usePortal={true}
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
                  color: 'brand.primary',
                  transform: 'rotate(90deg)',
                  bgColor: '#E1E9FF',
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
                  frontLabel='To'
                  options={options}
                  inputName='to_input'
                  selectName='to_select'
                  control={control}
                  watch={watch}
                  defaultValue=''
                  defaultOption={defaultValues.to_select}
                  usePortal={true}
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
                      722.224 {from_select.label} per {to_select.label}
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
              <Center>
                <Text sx={{ color: 'red.600', mb: '24px', fontSize: '14px' }}>
                  <InfoOutlineIcon sx={{ mr: '9px' }} />
                  Insufficient USDT balance！
                </Text>
              </Center>
              <Center>
                <Button colorScheme='primary' sx={{ w: '224px', h: '45px', fontSize: '18px', lineHeight: '25px' }}>
                  Confirm
                </Button>
              </Center>
            </Box>
          </Center>
        </Box>
      </PageMain>
    </PageLayout>
  );
};

export default Swap;
