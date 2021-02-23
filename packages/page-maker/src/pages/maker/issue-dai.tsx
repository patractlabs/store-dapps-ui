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
  FormLabel,
  Input,
  Fixed,
  InputGroup,
  InputNumber,
  HStack,
  useNumberInput
} from '@patract/ui-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractTx } from '@patract/react-hooks';
import { parseAmount } from '@patract/utils';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { api } from '@patract/react-components';
import { RightSymbol } from './right-symbol';

const IssueDAI: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  price: number;
  decimals: number;
}> = ({ isOpen, onClose, onSubmit, price, decimals }) => {
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

  const close = () => {
    setCollateral('');
    setEstimatedIssuance('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([collateralRatio], parseAmount(collateral, decimals))
      .then(() => {
        close();
        onSubmit && onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onCollateralChange = (val: string): void => {
    setCollateral(val);
  };

  const disabled = useMemo(() => {
    const _collateral = parseFloat(collateral);
    const ratio = parseFloat(collateralRatio.toString());
    const times = Math.pow(10, decimals);
    const _balance = parseFloat(balance) / times;
    return `${_collateral}` === 'NaN' || _collateral <= 0 || ratio < 150 || _collateral > _balance;
  }, [collateral, collateralRatio, decimals, balance]);

  useMemo(() => {
    const _collateral = parseFloat(collateral);
    const _collateralRatio = parseFloat(`${collateralRatio}`) / 100;
    const _estimatedIssuance = _collateral * price / _collateralRatio;

    setEstimatedIssuance(`${_estimatedIssuance}` === 'NaN' ? '' : `${_estimatedIssuance.toFixed(3)}`);
  }, [collateralRatio, collateral, price]);

  useEffect(() => {
    api.derive.balances.all(currentAccount).then(account => {
      setBalance(account.availableBalance.toString()); 
    });
  }, [currentAccount]);

  return (
    <Modal variant="maker" isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Issue DAI</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>Collateral</span>
              <span>
                Balance: <Fixed value={balance} decimals={decimals} /> DOT
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber focusBorderColor="primary.500" background='white' value={collateral} onChange={ onCollateralChange } />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
          </FormControl>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: '#666666', fontSize: '12px' }}>
              <span>Collateral Ratio</span>
            </FormLabel>
            <HStack alignItems='center'>
              <InputGroup>
                <Input focusBorderColor="primary.500" {...input} background='white' />
                <RightSymbol symbol={'%'} />
              </InputGroup>
              <Button
                {...inc}
                sx={{
                  h: '40px',
                  border: '0',
                  bgColor: 'white',
                  color: 'primary.500',
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
                  color: 'primary.500',
                  boxShadow: '0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
                }}
              >
                -
              </Button>
            </HStack>
          </FormControl>
          <FormControl>
              <FormLabel>
                <span style={{ color: '#666666', fontSize: '12px' }}>Estimated Issuance</span>
              </FormLabel>
              <InputGroup>
                <InputNumber isReadOnly={true}  bgColor="#F9FAFB"  focusBorderColor="border.100" value={estimatedIssuance} />
                <RightSymbol symbol={'DAI'} />
              </InputGroup>
            </FormControl>
        </ModalBody>
        <ModalFooter>
            <Button isDisabled={disabled} isLoading={isLoading} colorScheme="blue" bgColor="primary.500" height="2em" onClick={submit}>
              Confirm
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IssueDAI;