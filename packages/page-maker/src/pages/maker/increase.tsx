import { useContractTx } from '@patract/react-hooks';
import { Button, Fixed, FormControl, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { RightSymbol } from './right-symbol';
import { CDP } from './types';

const Increase: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cdp?: CDP;
  price?: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [ increase, setCollateral ] = useState<string>('');
  const [ ratio, setCollateralRatio ] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Increase Collateral', contract, method: 'addCollateral' });

  const close = () => {
    setCollateral('');
    setCollateralRatio('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id], increase)
      .then((data) => {
        console.log('increase', data)
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  useMemo(() => {
    const _collateral = parseFloat(increase);
    if (`${_collateral}` === 'NaN' || !cdp || !cdp.issue_dai) {
      return setCollateralRatio('');
    }
    const estimatedRatio = (cdp!.collateral_dot + _collateral) * price! / cdp.issue_dai * 100;
    setCollateralRatio(estimatedRatio.toFixed(0));
  }, [increase, cdp, price]);

  return (
    <Modal  variant="maker" isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl' background='#F8F8F8' borderRadius='4px'>
        <ModalHeader>Increase</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>Increase Collateral</span>
              <span>
                Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={ 0 } /> DOT
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber value={increase} onChange={setCollateral} />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>Estimated New Collateral Ratio</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isDisabled={ true } value={ratio} />
              <RightSymbol symbol={'%'} />
            </InputGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter py={8}>
          <Button isDisabled={!increase || !ratio || parseFloat(ratio) < 150 || parseFloat(increase) <= 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Increase;