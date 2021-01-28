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
  SimpleGrid
} from '@patract/ui-components';
import { useForm } from 'react-hook-form';
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

const CreatePair = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { control, watch } = useForm({ defaultValues });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>
          <Center>Create a pair</Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={8}>
          <SimpleGrid column={1} spacing='8'>
            <FormControl>
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
            <FormControl>
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
          </SimpleGrid>
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
