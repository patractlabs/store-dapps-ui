import React from 'react';
import {
  Box,
  Flex,
  Button,
  Center,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import InputSelect, { MenuOption } from '../../components/input-select';
import USDTIcon from '../../images/usdt.png';

const options: Array<MenuOption> = [
  { value: 'usdt', label: 'USDT', icon: USDTIcon, fullName: 'Tether', address: 'GAneP4k…fJEfs', balance: 0 },
  { value: 'eth', label: 'ETH', icon: USDTIcon, fullName: 'Ethereum', address: 'GAneP4k…fJEfs', balance: 150000.9912 }
];

const defaultValues = {
  input_1: '',
  select_1: options[0],
  input_2: '',
  select_2: options[0]
};

const Add = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { control, watch } = useForm({ defaultValues });
  const { select_1, select_2 } = watch(['select_1', 'select_2']);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ w: '624px', maxW: 'auto' }}>
        <ModalHeader
          sx={{
            color: '#0058FA',
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '24px',
            py: '13px',
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Center>Add Liquidity</Center>
        </ModalHeader>
        <ModalCloseButton sx={{ color: '#999999' }} />
        <ModalBody sx={{ bgColor: '#F8F8F8', pt: '40px', pb: '20px', pl: '76px', pr: '84px' }}>
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              frontLabel='Input'
              backLabel='balance: 0'
              options={options}
              inputName='input_1'
              selectName='select_1'
              control={control}
              defaultValue=''
            />
          </FormControl>
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              frontLabel='Input'
              backLabel='balance: 0'
              options={options}
              inputName='input_2'
              selectName='select_2'
              control={control}
              defaultValue=''
            />
          </FormControl>
          <Flex>
            <FormControl sx={{ mr: '9px' }}>
              <FormLabel textStyle='form-label'>Price and pool share</FormLabel>
              <Flex
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #ABB4D0',
                  p: '19px 16px',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Center>
                    <Text sx={{ fontSize: '14px', fontWeight: '500' }}>722.224</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: '12px' }}>
                      {select_1.label} per {select_2.label}
                    </Text>
                  </Center>
                </Box>
                <Box>
                  <Center>
                    <Text sx={{ fontSize: '14px', fontWeight: '500' }}>0.000885129</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: '12px' }}>
                      {select_2.label} per {select_1.label}
                    </Text>
                  </Center>
                </Box>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel textStyle='form-label'>
                <span>LP Tokens</span>
                <span>Balance:0</span>
              </FormLabel>
              <Flex
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #ABB4D0',
                  p: '19px 16px',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Center>
                    <Text sx={{ fontSize: '14px', fontWeight: '500' }}>15</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: '12px' }}>You will receive</Text>
                  </Center>
                </Box>
                <Box>
                  <Center>
                    <Text sx={{ fontSize: '14px', fontWeight: '500' }}>150</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: '12px' }}>Total supply</Text>
                  </Center>
                </Box>
              </Flex>
            </FormControl>
          </Flex>
          <Center>
            <Text sx={{ color: 'red.600', mt: '24px', fontSize: '14px' }}>
              <InfoOutlineIcon sx={{ mr: '9px' }}/>
              Insufficient USDT balance！
            </Text>
          </Center>
        </ModalBody>

        <ModalFooter sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose} colorScheme='primary'>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Add;
