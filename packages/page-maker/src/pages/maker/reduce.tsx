import { useContractTx } from '@patract/react-hooks';
import { Button, Fixed, FormControl, FormHelperText, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@patract/ui-components';
import { parseAmount, toFixed } from '@patract/utils';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { RightSymbol } from './right-symbol';
import { SystemParams } from './system-params';
import { CDP } from './types';

const ReduceCollateral: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  decimals: number;
  systemParams: SystemParams,
}> = ({ isOpen, onClose, onSubmit, cdp, decimals, systemParams }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [ decrease, setCollateral ] = useState<string>('');
  const [ ratio, setCollateralRatio ] = useState<string>('');
  const [calculation, setCalculation] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Reduce Collateral', contract, method: 'minusCollateral' });

  const close = () => {
    setCollateral('');
    setCollateralRatio('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, parseAmount(decrease, decimals)])
      .then((data) => {
        console.log('reduce', data)
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const disabled = useMemo(() => {
    const _decrease = parseFloat(decrease);
    const times = Math.pow(10, decimals);
    const _ratio = parseFloat(ratio)

    if (!cdp) {
      return false;
    }
    return `${_decrease}` === 'NaN' || _decrease <= 0 || (_decrease * times) > cdp.collateral_dot || `${_ratio}` === 'NaN' || _ratio < systemParams.mcr;
  }, [decrease, cdp, decimals, ratio, systemParams.mcr]);

  useMemo(() => {
    if (!cdp) {
      return setCollateralRatio('');
    }
    const _decrease = parseFloat(decrease);
    const times = Math.pow(10, decimals);
    const estimatedRatio = (cdp!.collateral_dot / times - _decrease) * systemParams.currentPrice / (cdp.issue_dai / times) * 100;

    if (`${estimatedRatio}` === 'NaN') {
      setCollateralRatio('');
      setCalculation(``);
    } else {
      const collateral = toFixed(cdp.collateral_dot, decimals, false).round(3).toString();
      const issueDai = toFixed(cdp.issue_dai, decimals, false).round(3).toString();

      setCollateralRatio(estimatedRatio.toFixed(0));
      setCalculation(`${estimatedRatio.toFixed(0)} % = (${collateral} DOT - ${decrease} DOT) * $${systemParams.currentPrice} / ${issueDai} DAI`);
    }
  }, [decrease, cdp, systemParams.currentPrice, decimals]);

  return (
    <Modal variant="maker" isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Reduce</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Reduce Collateral</span>
              <span>
                Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={decimals} /> DOT
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber focusBorderColor="primary.500" background='white' value={decrease} onChange={ setCollateral } />
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
          <Button isDisabled={disabled} isLoading={isLoading} colorScheme='blue' bgColor="primary.500" height="2em" onClick={submit}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReduceCollateral;