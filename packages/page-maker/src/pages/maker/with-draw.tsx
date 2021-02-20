import { SliderThumb, SliderFilledTrack, SliderTrack, Slider, Button, Fixed, FormControl, FormLabel, Text, InputGroup, InputNumber, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { useContractTx } from '@patract/react-hooks';
import { CDP } from './types';

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
    // setRedeem(cdp.issue_dai);
  }, [redeem, cdp, price]);

  useMemo(() => {
    if (!cdp) {
      return setRedeem(0);
    }
    setRedeem(cdp.issue_dai);
  }, [cdp]);

  return (
    <Modal isOpen={ isOpen } onClose={ close }>
      <ModalOverlay />
      <ModalContent maxW='2xl' background='#F8F8F8' borderRadius='4px'>
        <ModalHeader>Withdraw</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid column={1} spacing='8'>
            <FormControl>
              <FormLabel>
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
              <FormLabel>
                <span>Estimated Collateral Release:</span>
              </FormLabel>
              <InputGroup>
                <InputNumber isDisabled={ true } value={ release } />
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
            <Button isDisabled={!redeem || !cdp || redeem > cdp!.issue_dai || redeem <= 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Confirm
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Withdraw;