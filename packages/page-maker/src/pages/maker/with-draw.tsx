import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, Fixed, FormControl, FormLabel, InputGroup, InputNumber, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { useContractTx } from '@patract/react-hooks';
import { CDP } from './types';
import { RightSymbol } from './right-symbol';

const Withdraw: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cdp?: CDP;
  price: number;
  decimals: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price, decimals }): ReactElement => {
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
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const disabled = useMemo(() => {
    if (!cdp) {
      return false;
    }
    return redeem > cdp.issue_dai || redeem <= 0
  }, [redeem, cdp]);

  useMemo(() => {
    if (!cdp || !price) {
      return setRelease('');
    }
    const times = Math.pow(10, decimals);
    const _release = cdp.collateral_ratio / 100 * redeem / times / price;
    setRelease(`${_release}` === 'NaN' ? '' : `${_release}`);
  }, [redeem, cdp, price, decimals]);

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
        <ModalHeader>Withdraw</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>
                Redeem: <Fixed value={redeem} decimals={decimals} /> DAI
              </span>
              <span>
                Total Issuance: <Fixed value={cdp?.issue_dai} decimals={decimals} /> DAI
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
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>Estimated Collateral Release:</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isReadOnly={true} bgColor="#F9FAFB" focusBorderColor="border.100" value={ release } />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
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