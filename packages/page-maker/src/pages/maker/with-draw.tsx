import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, Fixed, FormControl, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { useContractTx } from '@patract/react-hooks';
import { CDP } from './types';
import { RightSymbol } from './right-symbol';

const Withdraw: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cdp?: CDP;
  price?: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeem, setRedeem] = useState<number>(0);
  const [release, setRelease] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Withdraw Collateral', contract, method: 'withdrawDot' });

  const close = () => {
    // setRedeem();
    // setRelease('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, redeem])
      .then((data) => {
        console.log('withdraw', data)
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useMemo(() => {
    if (`${redeem}` === 'NaN' || !cdp || !price) {
      return setRelease('');
    }
    const _release = cdp!.collateral_ratio / 100 * redeem / price;
    setRelease(`${_release}`);
  }, [redeem, cdp, price]);

  useMemo(() => {
    if (!cdp) {
      return setRedeem(0);
    }
    setRedeem(cdp.issue_dai);
  }, [cdp]);

  return (
    <Modal variant="maker" isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl' background='#F8F8F8' borderRadius='4px'>
        <ModalHeader>Withdraw</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>
                Redeem: <Fixed value={redeem} decimals={ 0 } /> DAI
              </span>
              <span>
                Total Issuance: <Fixed value={cdp?.issue_dai} decimals={ 0 } /> DAI
              </span>
            </FormLabel>
            <Slider min={0} max={(cdp && cdp.issue_dai) || 0} aria-label="slider-ex-1" value={redeem} onChange={setRedeem} focusThumbOnChange={false}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>Estimated Collateral Release:</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isDisabled={ true } value={ release } />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter py={8}>
          <Button isDisabled={!redeem || !cdp || redeem > cdp!.issue_dai || redeem <= 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Withdraw;