import React from 'react';
import {
  Center,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import Select from 'react-select';
import USDTIcon from '../../images/usdt.png';

const Add = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const options = [
    { value: 'usdt', label: 'USDT', icon: USDTIcon },
    { value: 'eth', label: 'ETH', icon: USDTIcon }
  ];
  const selectStyles = {
    container: (styles: any) => ({ ...styles, display: 'inline-block', verticalAlign: 'top', width: '111px' }),
    control: (styles: any) => ({
      ...styles,
      borderRadius: '0 4px 4px 0',
      borderColor: '#0058FA',
      borderLeft: '0',
      boxShadow: 'none',
      ':hover': { borderColor: '#0058FA' }
    }),
    valueContainer: (styles: any) => ({ ...styles, padding: '5px 0' }),
    singleValue: (styles: any) => ({
      ...styles,
      fontSize: '18px',
      lineHeight: '25px',
      background: '#E1E9FF',
      borderRadius: '4px',
      minWidth: '74px',
      padding: '5px 0',
      textAlign: 'center'
    }),
    indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' })
  };

  const dropdownIndicator = () => <TriangleDownIcon sx={{ color: '#0058FA' }} />;

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
            <Image
              src={USDTIcon}
              sx={{
                display: 'inline-block',
                w: '44px',
                h: '44px',
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: '#0058FA',
                bgColor: '#FFFFFF'
              }}
            />
            <Select
              defaultValue={options[0]}
              label='Single select'
              options={options}
              styles={selectStyles}
              dropdownIndicator={dropdownIndicator}
            />
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
