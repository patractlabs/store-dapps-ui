import React from 'react';
import {
  Center,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import Select from 'react-select';

const Add = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const options = [{ value: 'usdt', label: 'USDT' }];
  const selectStyles = {
    container: (styles: any) => ({ ...styles, display: 'inline-block', width: '155px' }),
    control: (styles: any) => ({ ...styles, borderRadius: '0 4px 4px 0', borderColor: '#0058FA', borderLeft: '0' }),
    valueContainer: (styles: any) => ({ ...styles, paddingTop: '3px', paddingBottom: '3px' })
  };
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
          <FormControl id='input_1'>
            <FormLabel>Input</FormLabel>
            <Input
              type='text'
              focusBorderColor='#0058FA'
              sx={{
                w: '309px',
                h: '45px',
                fontSize: '18px',
                bgColor: '#FFFFFF',
                borderRadius: '4px 0 0 4px',
                border: '1px solid',
                borderColor: '#0058FA',
                borderRight: '0',
                _hover: { borderColor: '#0058FA' },
                _focus: { boxShadow: 'none' }
              }}
            />
            <Select defaultValue={options[0]} label='Single select' options={options} styles={selectStyles} />
          </FormControl>
        </ModalBody>

        <ModalFooter sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Add;
