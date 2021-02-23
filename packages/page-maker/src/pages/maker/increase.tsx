import { useContractTx } from '@patract/react-hooks';
import { Button, Fixed, FormControl, FormHelperText, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { RightSymbol } from './right-symbol';
import { CDP } from './types';
import { parseAmount, toFixed } from '@patract/utils';

const Increase: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  price: number;
  decimals: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price, decimals }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [ increase, setIncrease ] = useState<string>('');
  const [ ratio, setCollateralRatio ] = useState<string>('');
  const [calculation, setCalculation] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Increase Collateral', contract, method: 'addCollateral' });

  const close = () => {
    setIncrease('');
    setCollateralRatio('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id], parseAmount(increase, decimals))
      .then(() => {
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const disabled = useMemo(() => {
    const _increase = parseFloat(increase);
    return `${_increase}` === 'NaN' || _increase <= 0;
  }, [increase]);

  useMemo(() => {
    if (!cdp) {
      return setCollateralRatio('');
    }
    const _increase = parseFloat(increase);
    const times = Math.pow(10, decimals);
    const estimatedRatio = (cdp.collateral_dot / times + _increase) * price / (cdp.issue_dai / times) * 100;

    if (`${estimatedRatio}` === 'NaN') {
      setCollateralRatio('');
      setCalculation(``);
    } else {
      const collateral = toFixed(cdp.collateral_dot, decimals, false).round(3).toString();
      const issueDai = toFixed(cdp.issue_dai, decimals, false).round(3).toString();

      setCollateralRatio(estimatedRatio.toFixed(0));
      setCalculation(`${estimatedRatio.toFixed(0)} = (${collateral} DOT + ${increase} DOT) * $${price} / ${issueDai} DAI`);
    }
  }, [increase, cdp, price, decimals]);

  return (
    <Modal variant="maker" isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Increase</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Increase Collateral</span>
              <span>
                Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={ decimals } /> DOT
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber focusBorderColor="primary.500" background='white' value={increase} onChange={setIncrease} />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Estimated New Collateral Ratio</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isReadOnly={true}  bgColor="#F9FAFB"  focusBorderColor="border.100" value={ratio} />
              <RightSymbol symbol={'%'} />
            </InputGroup>
            <FormHelperText textAlign="right" h="18px">
              <span style={{ color: 'brand.grey', fontSize: '12px' }}>{ calculation }</span>
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter py={8}>
          <Button isDisabled={disabled} isLoading={isLoading} colorScheme="blue" bgColor="primary.500" height="2em" onClick={submit}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Increase;