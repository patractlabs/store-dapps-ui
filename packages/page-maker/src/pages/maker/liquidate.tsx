import { useContractTx } from '@patract/react-hooks';
import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, FormControl, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormHelperText } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useContext, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { CDP } from './types';
import { SystemParams } from './system-params';
import { RightSymbol } from './right-symbol';
import ApiContext from '@patract/react-components/api/api-context';
import { parseAmount } from '@patract/utils';

const Liquidate: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  systemParams: SystemParams;
  daiDecimals: number;
}> = ({ isOpen, onClose, onSubmit, cdp, systemParams, daiDecimals }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeem, setRedeem] = useState<number>(0);
  const [maxRedeem, setMaxRedeem] = useState<number>(0);
  const [dotYouGot, setDotYouGot] = useState<string>('');
  const [calculation, setCalculation] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Liquidate Collateral', contract, method: 'liquidateCollateral' });
  const { tokenDecimals: dotDecimals } = useContext(ApiContext);

  const close = () => {
    // setRedeem(0);
    // setDotYouGot('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    // console.log(cdp!.issue_dai, parseAmount(`${redeem}`, daiDecimals), 'liqui', redeem === maxRedeem ? cdp!.issue_dai : parseAmount(`${redeem}`, daiDecimals))
    // excute([cdp!.id, redeem === maxRedeem ? cdp!.issue_dai : parseAmount(`${redeem}`, daiDecimals)])
    excute([cdp!.id, parseAmount(`${redeem}`, daiDecimals)])
      .then((data) => {
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useMemo(() => {
    if (!cdp) {
      setDotYouGot('');
      return setCalculation(``);
    }
    const _dotYouGot = redeem / systemParams.currentPrice * (100 + systemParams.lrr) / 100;
    // const _dotYouGot = cdp.collateral_dot * Math.pow(10, daiDecimals - dotDecimals) / cdp.issue_dai * redeem;

    if (`${_dotYouGot}` === 'NaN') {
      setDotYouGot('');
      setCalculation(``);
    } else {
      setDotYouGot(`${_dotYouGot.toFixed(3)}`);
      setCalculation(`${_dotYouGot.toFixed(3)} DOT = ${redeem.toFixed(3)} DAI / $${systemParams.currentPrice} * (1 + ${systemParams.lrr}%)`);
    }
  }, [redeem, systemParams, cdp]);

  useMemo(() => {
    if (!cdp) {
      return setMaxRedeem(0);
    }

    const daiTimes = Math.pow(10, daiDecimals);
    const dotTimes = Math.pow(10, dotDecimals);
    let _maxRedeem = cdp.issue_dai / daiTimes;
    if (cdp.collateral_ratio < 100 + systemParams.lrr ) {
      _maxRedeem = cdp.collateral_dot / dotTimes * systemParams.currentPrice / (100 + systemParams.lrr) * 100;
    }
    if (`${_maxRedeem}` === 'NaN') {
      setRedeem(0);
      return setMaxRedeem(0);
    }
    setMaxRedeem(_maxRedeem);
    setRedeem(_maxRedeem);
  }, [cdp, systemParams, dotDecimals, daiDecimals]);

  return (
    <Modal variant="maker" isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Liquidate</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>
                Redeem: { redeem.toFixed(3)} DAI
              </span>
              <span>
                Current Issuance: { ((cdp?.issue_dai || 0) / Math.pow(10, daiDecimals)).toFixed(3) } DAI
              </span>
            </FormLabel>
            <Slider min={0} max={maxRedeem} aria-label="slider-ex-1" defaultValue={redeem} onChange={setRedeem}>
              <SliderTrack h="10px" borderRadius="5px">
                <SliderFilledTrack bg="linear-gradient(180deg, #25A17C 0%, #008065 100%)" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Estimated Collateral You Can Get</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isReadOnly={true}  bgColor="#F9FAFB"  focusBorderColor="border.100" value={ dotYouGot } />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
            <FormHelperText textAlign="right" h="18px">
              <span style={{ color: 'brand.grey', fontSize: '12px' }}>{ calculation }</span>
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter py={8}>
          <Button isDisabled={redeem === 0} isLoading={isLoading} colorScheme='blue' bgColor="primary.500" height="2em" onClick={submit}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Liquidate;