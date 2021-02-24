import { useContractTx } from '@patract/react-hooks';
import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, Fixed, FormControl, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormHelperText } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { CDP } from './types';
import { SystemParams } from './system-params';
import { RightSymbol } from './right-symbol';
import { toFixed } from '@patract/utils';

const Liquidate: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  systemParams: SystemParams;
  decimals: number;
}> = ({ isOpen, onClose, onSubmit, cdp, systemParams, decimals }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeem, setRedeem] = useState<number>(0);
  const [maxRedeem, setMaxRedeem] = useState<number>(0);
  const [dotYouGot, setDotYouGot] = useState<string>('');
  const [calculation, setCalculation] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Liquidate Collateral', contract, method: 'liquidateCollateral' });

  const close = () => {
    // setRedeem(0);
    // setDotYouGot('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, `${redeem}`])
      .then((data) => {
        console.log('liquidate', data)
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useMemo(() => {
    const times = Math.pow(10, decimals);
    const _dotYouGot = redeem / times / systemParams.currentPrice * (100 + systemParams.lrr) / 100;

    if (`${_dotYouGot}` === 'NaN') {
      setDotYouGot('');
      setCalculation(``);
    } else {
      const _redeem = toFixed(redeem, decimals, false).round(3).toString();
      setDotYouGot(`${_dotYouGot.toFixed(3)}`);
      setCalculation(`${_dotYouGot.toFixed(3)} DOT = ${_redeem} DAI / $${systemParams.currentPrice} * (1 + ${systemParams.lrr}%)`);
    }
  }, [redeem, systemParams, decimals]);

  useMemo(() => {
    if (!cdp) {
      return setMaxRedeem(0);
    }
    const _maxRedeem = cdp.collateral_dot * systemParams.currentPrice / (100 + systemParams.lrr) * 100;
    if (`${_maxRedeem}` === 'NaN') {
      setRedeem(_maxRedeem);
      return setMaxRedeem(0);
    }
    setMaxRedeem(_maxRedeem);
    setRedeem(_maxRedeem);
  }, [cdp, systemParams]);

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
                Redeem: <Fixed value={redeem} decimals={decimals} /> DAI
              </span>
              <span>
                Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={decimals} /> DOT
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