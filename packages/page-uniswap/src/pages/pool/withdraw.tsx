import React, { useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Center,
  FormControl,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Flex,
  Stack,
  FormLabel,
  Text
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { InputNumberController } from '@patract/ui-components';
import InputSelect, { MenuOption } from '../../components/input-select';
import USDTIcon from '../../images/usdt.png';

const options: Array<MenuOption> = [
  { value: 'usdt', label: 'USDT', icon: USDTIcon, fullName: 'Tether', address: 'GAneP4k…fJEfs', balance: 0 },
  { value: 'eth', label: 'ETH', icon: USDTIcon, fullName: 'Ethereum', address: 'GAneP4k…fJEfs', balance: 150000.9912 }
];

const defaultValues = {
  withdraw_token: 1,
  input_1: '',
  select_1: options[0],
  input_2: '',
  select_2: options[1]
};

const balance = 15;

const Withdraw = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { control, watch, setValue } = useForm({ defaultValues });
  const { withdraw_token } = watch(['withdraw_token']);
  const percentage = Math.ceil((withdraw_token * 100) / 15);

  const onSliderChange = useCallback(
    (value: number) => {
      setValue('withdraw_token', (value * balance) / 100);
    },
    [setValue]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Withdraw Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ mb: '24px' }}>
            <FormLabel textStyle='form-label'>
              <span>Withdraw LP Token</span>
              <span>Balance: {balance}</span>
            </FormLabel>
            <InputNumberController
              name='withdraw_token'
              control={control}
              defaultValue={defaultValues.withdraw_token}
              max={balance}
              sx={{
                w: 'calc(100% - 160px)',
                h: '44px',
                fontSize: 'lg',
                borderRadius: '4px 0 0 4px',
                borderRight: '0',
                verticalAlign: 'top',
                _focus: { boxShadow: 'none' }
              }}
            />
            <Box
              width='160px'
              border='1px solid'
              borderColor='gray.200'
              sx={{
                display: 'inline-block',
                verticalAlign: 'top',
                border: '1px solid',
                borderRadius: '0 4px 4px 0',
                borderLeft: '0'
              }}
            >
              <Center>
                <Box
                  sx={{
                    verticalAlign: 'top',
                    background: '#E1E9FF',
                    borderRadius: '4px',
                    minWidth: '144px',
                    padding: '3px 13px',
                    textAlign: 'center',
                    left: '42px',
                    my: '5px'
                  }}
                >
                  <Text sx={{ display: 'inline-block', fontSize: 'lg', lineHeight: '24px', mr: '3px' }}>LP</Text>
                  <Text sx={{ display: 'inline-block', fontSize: 'xs', lineHeight: '24px', color: 'brand.grey' }}>
                    (USDT-ETH)
                  </Text>
                </Box>
              </Center>
            </Box>
            <Slider value={percentage} sx={{ mt: '2.5' }} onChange={onSliderChange} focusThumbOnChange={false}>
              <SliderTrack>
                <SliderFilledTrack bg='#25A17C' />
              </SliderTrack>
              <SliderThumb
                boxSize={6}
                sx={{ borderRadius: '4px', border: '1px solid', borderColor: '#25A17C', boxShadow: 'none' }}
              >
                <Flex>
                  <Box width='1px' height='10px' mr='6px' bgColor='#E5E5E5' />
                  <Box width='1px' height='10px' bgColor='#E5E5E5' />
                </Flex>
              </SliderThumb>
            </Slider>
          </FormControl>
          <FormControl sx={{ mb: '6' }}>
            <InputSelect
              frontLabel='You will receive (estimated)'
              options={options}
              inputName='input_1'
              selectName='select_1'
              control={control}
              watch={watch}
              defaultValue=''
              defaultOption={options[0]}
            />
          </FormControl>
          <FormControl>
            <InputSelect
              frontLabel='You will receive (estimated)'
              options={options}
              inputName='input_2'
              selectName='select_2'
              control={control}
              watch={watch}
              defaultValue=''
              defaultOption={options[1]}
            />
          </FormControl>
          {/* <Center>
            <Text sx={{ color: 'red.600', mt: '6', fontSize: 'sm' }}>
              <InfoOutlineIcon sx={{ mr: '9px' }} />
              Insufficient USDT balance！
            </Text>
          </Center> */}
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button colorScheme='blue' onClick={onClose}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Withdraw;
