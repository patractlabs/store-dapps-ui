import { Button, Fixed, FormControl, FormLabel, Text, HStack, Input, InputGroup, InputNumber, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack } from '@patract/ui-components';
import React, { FC, ReactElement } from 'react';

const ReduceCollateral: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ isOpen, onClose, onSubmit }): ReactElement => {

  const close = () => {
    // setCollateral('');
    // setEstimatedIssuance('');
    onClose();
  };

  return (
    <Modal isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl' background='#F8F8F8' borderRadius='4px'>
        <ModalHeader>Reduce</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid column={1} spacing='8'>
            <FormControl>
              <FormLabel>
                <span>Reduce Collateral</span>
                <span>
                  Current Collateral: <Fixed value={100.1} decimals={ 0 } /> DOT
                </span>
              </FormLabel>
              <InputGroup>
                {/* <InputNumber value={collateral} onChange={ onCollateralChange } /> */}
                <InputRightElement
                  width={40}
                  children={
                    <Text
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: 'lg',
                        lineHeight: 'short',
                        background: '#E1E9FF',
                        borderRadius: '4px',
                        minWidth: '74px',
                        textAlign: 'center',
                      }}
                    >
                      DOT
                    </Text>
                  }
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>
                <span>Estimated Issuance</span>
              </FormLabel>
              <InputGroup>
                {/* <InputNumber isDisabled={ true } value={estimatedIssuance} /> */}
                <InputRightElement
                  width={40}
                  children={
                    <Text
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: 'lg',
                        lineHeight: 'short',
                        background: '#E1E9FF',
                        borderRadius: '4px',
                        minWidth: '74px',
                        textAlign: 'center',
                      }}
                    >
                      DAI
                    </Text>
                  }
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='center'>
            {/* <Button isDisabled={!collateralRatio || parseFloat(`${collateralRatio}`) < 150 || !collateral || !estimatedIssuance} isLoading={isLoading} colorScheme='blue' onClick={submit}> */}
              {/* Confirm
            </Button> */}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReduceCollateral;