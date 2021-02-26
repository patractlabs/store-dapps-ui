import { useContractTx } from '@patract/react-hooks';
import { Button, FormControl, FormHelperText, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@patract/ui-components';
import { parseAmount } from '@patract/utils';
import React, { FC, ReactElement, useContext, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { RightSymbol } from './right-symbol';
import { SystemParams } from './system-params';
import { CDP } from './types';
import ApiContext from '@patract/react-components/api/api-context';

const ReduceCollateral: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  daiDecimals: number;
  systemParams: SystemParams,
}> = ({ isOpen, onClose, onSubmit, cdp, daiDecimals, systemParams }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [ decrease, setCollateral ] = useState<string>('');
  const [ ratio, setCollateralRatio ] = useState<string>('');
  const [calculation, setCalculation] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Reduce Collateral', contract, method: 'minusCollateral' });
  const { tokenDecimals: dotDecimals } = useContext(ApiContext);

  const close = () => {
    setCollateral('');
    setCollateralRatio('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, parseAmount(decrease, dotDecimals)])
      .then((data) => {
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const disabled = useMemo(() => {
    const _decrease = parseFloat(decrease);
    const times = Math.pow(10, dotDecimals);
    const _ratio = parseFloat(ratio)

    if (!cdp) {
      return false;
    }
    return `${_decrease}` === 'NaN' || _decrease <= 0 || (_decrease * times) > cdp.collateral_dot || _ratio < systemParams.mcr;
  }, [decrease, cdp, dotDecimals, ratio, systemParams.mcr]);

  useMemo(() => {
    if (!cdp) {
      return setCollateralRatio('');
    }
    const _decrease = parseFloat(decrease);
    const dotTimes = Math.pow(10, dotDecimals);
    const daiTimes = Math.pow(10, daiDecimals);
    const estimatedRatio = (cdp.collateral_dot / dotTimes - _decrease) * systemParams.currentPrice / (cdp.issue_dai / daiTimes) * 100;
    
    if (`${estimatedRatio}` === 'NaN') {
      setCollateralRatio('');
      setCalculation(``);
    } else {
      const collateral = cdp.collateral_dot / Math.pow(10, dotDecimals);
      const issueDai = cdp.issue_dai / Math.pow(10, daiDecimals);

      setCollateralRatio(estimatedRatio.toFixed(1));
      setCalculation(`${estimatedRatio.toFixed(1)} % = (${collateral.toFixed(3)} DOT - ${decrease} DOT) * $${systemParams.currentPrice} / ${issueDai.toFixed(3)} DAI`);
    }
  }, [decrease, cdp, systemParams.currentPrice, daiDecimals, dotDecimals]);

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
                Current Collateral: { ((cdp?.collateral_dot || 0) / Math.pow(10, dotDecimals)).toFixed(3) } DOT
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