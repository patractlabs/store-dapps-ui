import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  FormLabel,
  Input,
  Fixed,
  InputGroup,
  InputNumber,
  InputRightElement,
  Text,
  HStack,
  useNumberInput
} from '@patract/ui-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractTx } from '@patract/react-hooks';
import { parseAmount, toFixed } from '@patract/utils';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { api } from '@patract/react-components';

const IssueDAI: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  currentPrice: number;
}> = ({ isOpen, onClose, onSubmit, currentPrice }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Issue DAI', contract, method: 'issueDai' });
  const [collateral, setCollateral] = useState<string>('');
  const [estimatedIssuance, setEstimatedIssuance] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, value: collateralRatio } = useNumberInput({
    step: 10,
    defaultValue: 150,
    min: 150,
    precision: 0,
  });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();
  const { currentAccount } = useAccount();
  useEffect(() => {
    api.derive.balances.all(currentAccount).then(account => {
      setBalance(account.availableBalance.toString()); 
    });
  }, [currentAccount]);
  const close = () => {
    setCollateral('');
    setEstimatedIssuance('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([collateralRatio], parseAmount(collateral.toString(), 10))
      .then(() => {
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onCollateralChange = (val: string): void => {
    setCollateral(val);
  };

  useMemo(() => {
    const _collateral = parseFloat(collateral);
    const _collateralRatio = parseFloat(`${collateralRatio}`) / 100;
    const _estimatedIssuance = _collateral * currentPrice / _collateralRatio;

    if (_collateral.toString() === 'NaN' || _collateralRatio.toString() === 'NaN' || _collateralRatio === 0) {
      setEstimatedIssuance('');
      return;  
    }
    setEstimatedIssuance(_estimatedIssuance.toString());
  }, [collateralRatio, collateral, currentPrice]);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl' background='#F8F8F8' borderRadius='4px'>
        <ModalHeader>Issue DAI</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid column={1} spacing='8'>
            <FormControl>
              <FormLabel>
                <span>Collateral</span>
                <span>
                  Balance: <Fixed value={balance} decimals={ 10 } /> DOT
                </span>
              </FormLabel>
              <InputGroup>
                <InputNumber value={collateral} onChange={ onCollateralChange } />
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
            <FormControl>
              <FormLabel>
                <span>Collateral Ratio</span>
              </FormLabel>
              <HStack alignItems='center'>
                <InputGroup>
                  <Input {...input} background='white' />
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
                        %
                      </Text>
                    }
                  />
                </InputGroup>
                <Button
                  {...inc}
                  sx={{
                    h: '40px',
                    border: '0',
                    bgColor: 'white',
                    color: 'blue.500',
                    boxShadow: '0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
                  }}
                >
                  +
                </Button>
                <Button
                  { ...dec }
                  sx={{
                    h: '40px',
                    border: '0',
                    bgColor: 'white',
                    color: 'blue.500',
                    boxShadow: '0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
                  }}
                >
                  -
                </Button>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>
                <span>Estimated Issuance</span>
              </FormLabel>
              <InputGroup>
                <InputNumber isDisabled={ true } value={estimatedIssuance} />
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
          </SimpleGrid>
        </ModalBody>
        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='center'>
            <Button isDisabled={!collateralRatio || parseFloat(`${collateralRatio}`) < 150 || parseFloat(collateral) <= 0 || parseFloat(collateral) > parseFloat(toFixed(balance, 10, false).round(3).toString())  || !estimatedIssuance} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Confirm
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IssueDAI;