import { useContractTx } from '@patract/react-hooks';
import { Button, Fixed, FormControl, FormLabel, Text, InputGroup, InputNumber, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack } from '@patract/ui-components';
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
  const [redeem, setRedeem] = useState<string>('');
  const [dotYouGot, setDotYouGot] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Liquidate Collateral', contract, method: 'liquidateCollateral' });

  const close = () => {
    setRedeem('');
    setDotYouGot('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, parseFloat(redeem)])
      .then((data) => {
        console.log('liquidate', data)
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDaiChange = (val: string) => {
    setRedeem(val)
  }

  useMemo(() => {
    const _redeem = parseFloat(redeem);
    if (`${_redeem}` === 'NaN' || !cdp || !price) {
      return setDotYouGot('');
    }
    const _dotYouGot = _redeem / price * 1.05;
    setDotYouGot(`${_dotYouGot}`);
  }, [redeem, cdp, price]);

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
                  Redeem: <Fixed value={500.1} decimals={ 0 } /> DAI
                </span>
                <span>
                  Current Collateral: <Fixed value={cdp?.collateral_dot} decimals={ 0 } /> DOT
                </span>
              </FormLabel>
              <InputGroup>
                <InputNumber value={ redeem } onChange={ onDaiChange } />
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
                      DAI
                    </Text>
                  }
                />
              </InputGroup>
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
            <Button isDisabled={!redeem || !cdp || parseFloat(redeem) > cdp!.issue_dai || parseFloat(redeem) <= 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Confirm
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Liquidate;