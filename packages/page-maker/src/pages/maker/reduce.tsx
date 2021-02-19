import { useContractTx } from '@patract/react-hooks';
import { Button, Fixed, FormControl, FormLabel, Text, HStack, Input, InputGroup, InputNumber, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { CDP } from './types';

const ReduceCollateral: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cdp?: CDP;
  price?: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [ decrease, setCollateral ] = useState<string>('');
  const [ ratio, setCollateralRatio ] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Reduce Collateral', contract, method: 'minusCollateral' });

  const close = () => {
    setCollateral('');
    setCollateralRatio('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, parseFloat(decrease)])
      .then((data) => {
        console.log('reduce', data)
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useMemo(() => {
    const _collateral = parseFloat(decrease);
    if (`${_collateral}` === 'NaN' || !cdp || !cdp.issue_dai) {
      return setCollateralRatio('');
    }
    const estimatedRatio = (cdp!.collateral_dot - _collateral) * price! / cdp.issue_dai * 100;
    setCollateralRatio(estimatedRatio.toFixed(0));
  }, [decrease, cdp, price]);

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
                  Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={ 0 } /> DOT
                </span>
              </FormLabel>
              <InputGroup>
                <InputNumber value={decrease} onChange={ setCollateral } />
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
                <span>Estimated New Collateral Ratio</span>
              </FormLabel>
              <InputGroup>
                <InputNumber isDisabled={true} value={ratio} />
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
                      %
                    </Text>
                  }
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='center'>
            <Button isDisabled={!decrease || !ratio || parseFloat(ratio) < 150 || parseFloat(decrease) <= 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Confirm
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReduceCollateral;