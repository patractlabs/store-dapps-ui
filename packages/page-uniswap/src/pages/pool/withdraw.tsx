import React from 'react';
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

const Withdraw = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { control } = useForm();

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
          <Center>Withdraw Liquidity</Center>
        </ModalHeader>
        <ModalCloseButton sx={{ color: '#999999' }} />
        <ModalBody sx={{ bgColor: '#F8F8F8', pt: '40px', pb: '20px', pl: '76px', pr: '84px' }}>
          <FormControl sx={{ mb: '24px' }}>
            <FormLabel textStyle='form-label'>
              <span>Withdraw LP Token</span>
              <span>Balance: 15</span>
            </FormLabel>
            <InputNumberController
              name='withdraw_token'
              control={control}
              defaultValue=''
              focusBorderColor='#0058FA'
              sx={{
                w: '309px',
                h: '44px',
                fontSize: '18px',
                bgColor: '#FFFFFF',
                borderRadius: '4px 0 0 4px',
                border: '1px solid',
                borderColor: '#0058FA',
                borderRight: '0',
                verticalAlign: 'top',
                _hover: { borderColor: '#0058FA' },
                _focus: { boxShadow: 'none' }
              }}
            />
            <Box
              sx={{
                display: 'inline-block',
                verticalAlign: 'top',
                width: '155px',
                border: '1px solid',
                borderRadius: '0 4px 4px 0',
                borderColor: '#0058FA',
                borderLeft: '0',
                bgColor: '#FFFFFF'
              }}
            >
              <Center>
                <Text
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
                  <Text sx={{ display: 'inline-block', fontSize: '18px', lineHeight: '24px', mr: '3px' }}>LP</Text>
                  <Text sx={{ display: 'inline-block', fontSize: '12px', lineHeight: '24px', color: 'brand.grey' }}>
                    (USDT-ETH)
                  </Text>
                </Text>
              </Center>
            </Box>
            <Slider defaultValue={25} sx={{ mt: '10px' }}>
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
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              frontLabel='You will receive (estimated)'
              options={options}
              inputName='input_1'
              selectName='select_1'
              control={control}
              defaultValue=''
            />
          </FormControl>
          <FormControl>
            <InputSelect
              frontLabel='You will receive (estimated)'
              options={options}
              inputName='input_2'
              selectName='select_2'
              control={control}
              defaultValue=''
            />
          </FormControl>
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

export default Withdraw;
