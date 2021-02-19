import { Button, Fixed, FormControl, FormLabel, Text, InputGroup, InputNumber, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack } from '@patract/ui-components';
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
  const [redeem, setRedeem] = useState<string>('');
  const [release, setRelease] = useState<string>('');
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Withdraw Collateral', contract, method: 'withdrawDot' });

  const close = () => {
    setRedeem('');
    setRelease('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([cdp!.id, parseFloat(redeem)])
      .then((data) => {
        console.log('withdraw', data)
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
      return setRelease('');
    }
    const _release = cdp!.collateral_ratio / 100 * _redeem / price;
    setRelease(`${_release}`);
  }, [redeem, cdp, price]);

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
                  Redeem: <Fixed value={500.1} decimals={ 0 } /> DAI
                </span>
                <span>
                  Total Issuance: <Fixed value={cdp?.issue_dai} decimals={ 0 } /> DAI
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
            <Button isDisabled={!redeem || !cdp || parseFloat(redeem) > cdp!.issue_dai || parseFloat(redeem) <= 0} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Confirm
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Withdraw;