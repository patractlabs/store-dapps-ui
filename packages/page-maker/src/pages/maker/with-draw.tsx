import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, Fixed, FormControl, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormHelperText } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { useContractTx } from '@patract/react-hooks';
import { CDP } from './types';
import { RightSymbol } from './right-symbol';
import { toFixed } from '@patract/utils';

const Withdraw: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  price: number;
  daiDecimals: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price, daiDecimals }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeem, setRedeem] = useState<number>(0);
  const [release, setRelease] = useState<string>('');
  const [calculation, setCalculation] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Withdraw Collateral', contract, method: 'withdrawDot' });

  const close = () => {
    // setRedeem();
    // setRelease('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    console.log('withd', cdp!.id, redeem + '', redeem);
    
    excute([cdp!.id, `${redeem}`])
      .then((data) => {
        console.log('withdraw', data)
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const disabled = useMemo(() => {
    return redeem <= 0;
  }, [redeem]);

  useMemo(() => {
    if (!cdp || !price) {
      return setRelease('');
    }
    const times = Math.pow(10, daiDecimals);
    const _release = cdp.collateral_ratio / 100 * redeem / times / price;

    if (`${_release}` === 'NaN') {
      setRelease('');
      setCalculation(``);
    } else {
      const _redeem = toFixed(`${redeem}`, daiDecimals, false).round(3).toString();
      setRelease(`${_release.toFixed(3)}`);
      setCalculation(`${_release.toFixed(3)} DOT = ${_redeem} DAI / $${price} * ${cdp.collateral_ratio.toFixed(1)}%`);
    }
  }, [redeem, cdp, price, daiDecimals]);

  useMemo(() => {
    if (!cdp) {
      return setRedeem(0);
    }
    setRedeem(cdp.issue_dai);
  }, [cdp]);

  return (
    <Modal variant="maker" isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Redeem</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>
                Redeem: <Fixed value={`${redeem}`} decimals={daiDecimals} /> DAI
              </span>
              <span>
                Total Issuance: <Fixed value={cdp?.issue_dai} decimals={daiDecimals} /> DAI
              </span>
            </FormLabel>
            <Slider min={0} max={(cdp && cdp.issue_dai) || 0} aria-label="slider-ex-1" value={redeem} onChange={setRedeem} focusThumbOnChange={false}>
              <SliderTrack h="10px" borderRadius="5px">
                <SliderFilledTrack bg="linear-gradient(180deg, #25A17C 0%, #008065 100%)" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Estimated Collateral Release</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isReadOnly={true} bgColor="#F9FAFB" focusBorderColor="border.100" value={ release } />
              <RightSymbol symbol={'DOT'} />
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

export default Withdraw;