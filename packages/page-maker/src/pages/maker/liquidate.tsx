import { useContractTx } from '@patract/react-hooks';
import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, Fixed, FormControl, FormLabel, Text, InputGroup, InputNumber, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { CDP } from './types';

const Liquidate: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cdp?: CDP;
  price?: number;
}> = ({ isOpen, onClose, onSubmit, cdp, price }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeem, setRedeem] = useState<number>(0);
  const [maxRedeem, setMaxRedeem] = useState<number>(0);
  const [dotYouGot, setDotYouGot] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Liquidate Collateral', contract, method: 'liquidateCollateral' });

  const close = () => {
    // setRedeem(0);
    // setDotYouGot('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, redeem])
      .then((data) => {
        console.log('liquidate', data)
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useMemo(() => {
    if (`${redeem}` === 'NaN' || !cdp || !price) {
      return setDotYouGot('');
    }
    const _dotYouGot = redeem / price * 1.05;
    setDotYouGot(`${_dotYouGot}`);
  }, [redeem, cdp, price]);

  useMemo(() => {
    if (!cdp || !price) {
      return setMaxRedeem(0);
    }
    const _maxRedeem = cdp.collateral_dot * price / 1.05;
    if (`${_maxRedeem}` === 'NaN') {
      return setMaxRedeem(0);
    }
    console.log('set max redeem', _maxRedeem);
    setMaxRedeem(_maxRedeem);
    setRedeem(_maxRedeem);
  }, [cdp, price]);

  return (
    <Modal isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl' background='#F8F8F8' borderRadius='4px'>
        <ModalHeader>Liquidate</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid column={1} spacing='8'>
            <FormControl>
              <FormLabel>
                <span>
                  Redeem: <Fixed value={redeem} decimals={ 0 } /> DAI
                </span>
                <span>
                  Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={ 0 } /> DOT
                </span>
              </FormLabel>
              <Slider min={0} max={maxRedeem} aria-label="slider-ex-1" defaultValue={redeem} onChange={setRedeem}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>
                <span>Estimated Collateral You Can Get</span>
              </FormLabel>
              <InputGroup>
                <InputNumber isDisabled={ true } value={ dotYouGot } />
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
          </SimpleGrid>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='center'>
            <Button isDisabled={!redeem || !cdp || redeem === 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Confirm
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Liquidate;