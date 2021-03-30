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
  Fixed,
  InputGroup,
  InputNumber,
  HStack,
  FormHelperText,
} from '@patract/ui-components';
import React, { FC, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractTx } from '@patract/react-hooks';
import { parseAmount } from '@patract/utils';
import { useMakerContract } from '../../hooks/use-maker-contract';
import { api } from '@patract/react-components';
import { RightSymbol } from './right-symbol';
import { SystemParams } from './system-params';
import ApiContext from '@patract/react-components/api/api-context';

const IssueDAI: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  systemParams: SystemParams;
  signal: number;
}> = ({ isOpen, onClose, onSubmit, systemParams, signal }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Issue DAI', contract, method: 'issueDai' });
  const [ collateral, setCollateral ] = useState<string>('');
  const [ collateralRatio, setCollateralRatio ] = useState<string>('');
  const [ calculation, setCalculation ] = useState<string>('');
  const [ estimatedIssuance, setEstimatedIssuance ] = useState<string>('');
  const [ balance, setBalance ] = useState<string>('');
  const { tokenDecimals: dotDecimals } = useContext(ApiContext);
  const { currentAccount } = useAccount();

  const onRatioChange = (val: string) => {
    setCollateralRatio(`${parseInt(val)}`  === 'NaN' ? '' : `${parseInt(val)}`);
  };

  const close = () => {
    setCollateral('');
    setEstimatedIssuance('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    
    excute([collateralRatio], parseAmount(collateral, dotDecimals))
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
    const ratio = parseFloat(collateralRatio);
    const times = Math.pow(10, dotDecimals);
    const _balance = parseFloat(balance) / times;
    return `${_collateral}` === 'NaN' || _collateral <= 0 || ratio < systemParams.mcr || _collateral > _balance;
  }, [collateral, collateralRatio, dotDecimals, balance, systemParams.mcr]);

  useMemo(() => {
    const _collateral = parseFloat(collateral);
    const _collateralRatio = parseFloat(`${collateralRatio}`) / 100;
    const _estimatedIssuance = _collateral * systemParams.currentPrice / _collateralRatio;

    if (`${_estimatedIssuance}` === 'NaN') {
      setEstimatedIssuance('');
      setCalculation('');
    } else {
      setEstimatedIssuance(`${_estimatedIssuance.toFixed(3)}`);
      setCalculation(`${_estimatedIssuance.toFixed(3)} DAI = ${_collateral} DOT * $${systemParams.currentPrice} / ${collateralRatio}%`);
    }
  }, [collateralRatio, collateral, systemParams.currentPrice]);

  useEffect(() => {
    api.query.system
      .account(currentAccount, (info) => {
        setBalance(info.data.free.toString());
      })
      .catch(() => {
        setBalance('');
      });
    // api.query.balances.account(currentAccount).then(x => console.log('ba', x.toHuman()));
    // api.derive.balances.all(currentAccount).then(account => setBalance(account.availableBalance.toString()));
  }, [currentAccount, signal]);

  useMemo(() => {
    setCollateralRatio(`${systemParams.mcr}`);
  }, [systemParams.mcr]);

  const onAdd = useCallback(() => {
    let ratio = parseFloat(collateralRatio);
    if (`${ratio}` === 'NaN' || ratio < systemParams.mcr) {
      return setCollateralRatio(`${systemParams.mcr}`);
    }
    ratio += 10;
    setCollateralRatio(ratio.toFixed(0));
  }, [systemParams.mcr, collateralRatio]);

  const onSub = useCallback(() => {
    let ratio = parseFloat(collateralRatio);
    if (`${ratio}` === 'NaN' || ratio < systemParams.mcr + 10) {
      return setCollateralRatio(`${systemParams.mcr}`);
    }
    ratio -= 10;
    setCollateralRatio(ratio.toFixed(0));
  }, [systemParams.mcr, collateralRatio]);

  return (
    <Modal variant="maker" isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl'>
        <ModalHeader>Issue DAI</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Collateral</span>
              <span>
              {/* { ((balance || 0) / Math.pow(10, dotDecimals)).toFixed(3) } */}
                Balance: <Fixed value={balance} decimals={dotDecimals} /> DOT
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber focusBorderColor="primary.500" background='white' value={collateral} onChange={ onCollateralChange } />
              <RightSymbol symbol={'DOT'} />
            </InputGroup>
          </FormControl>
          <FormControl sx={{ marginBottom: '21px' }}>
            <FormLabel sx={{ color: 'brand.grey', fontSize: '12px' }}>
              <span>Collateral Ratio</span>
            </FormLabel>
            <HStack alignItems='center'>
              <InputGroup>
                <InputNumber focusBorderColor="primary.500" background='white' value={collateralRatio} onChange={ onRatioChange}/>
                <RightSymbol symbol={'%'} />
              </InputGroup>
              <Button
                onClick={onAdd}
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
                onClick={onSub}
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
              <span style={{ color: 'brand.grey', fontSize: '12px' }}>Estimated Issuance</span>
            </FormLabel>
            <InputGroup>
              <InputNumber isReadOnly={true}  bgColor="#F9FAFB"  focusBorderColor="border.100" value={estimatedIssuance} />
              <RightSymbol symbol={'DAI'} />
            </InputGroup>
            <FormHelperText textAlign="right" h="18px">
              <span style={{ color: 'brand.grey', fontSize: '12px' }}>{ calculation }</span>
            </FormHelperText>
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