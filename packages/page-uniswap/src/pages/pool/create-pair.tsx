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
  FormControl
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import InputSelect, { MenuOption } from '../../components/input-select';
import USDTIcon from '../../images/usdt.png';

const options: Array<MenuOption> = [
  { value: 'usdt', label: 'USDT', icon: USDTIcon, fullName: 'Tether', address: 'GAneP4k…fJEfs', balance: 0 },
  { value: 'eth', label: 'ETH', icon: USDTIcon, fullName: 'Ethereum', address: 'GAneP4k…fJEfs', balance: 150000.9912 }
];

const CreatePair = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { control, watch } = useForm();

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
          <Center>Create a pair</Center>
        </ModalHeader>
        <ModalCloseButton sx={{ color: '#999999' }} />
        <ModalBody sx={{ bgColor: '#F8F8F8', pt: '40px', pb: '20px', pl: '76px', pr: '84px' }}>
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              frontLabel='From'
              options={options}
              inputName='from_input'
              selectName='from_select'
              control={control}
              watch={watch}
              defaultValue=''
              defaultOption={options[0]}
            />
          </FormControl>
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              frontLabel='To'
              options={options}
              inputName='to_input'
              selectName='to_select'
              control={control}
              watch={watch}
              defaultValue=''
              defaultOption={options[1]}
            />
          </FormControl>
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

export default CreatePair;
