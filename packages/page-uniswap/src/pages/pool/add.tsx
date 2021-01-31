import { useAccount, useContractQuery, useContractTx } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IdentityIcon,
  InputNumber,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@patract/ui-components';
import { formatAmount, parseAmount } from '@patract/utils';
import React, { useEffect, useState, useMemo } from 'react';
import { useToken } from '../../hooks/useTokenFactory';
import { useLPtokenBalance } from '../../hooks/useLPtokenBalance';
import { useLPtokenContract } from '../../hooks/useLPtokenContract';
import { useExchange } from '../../hooks/useExchangeFactory';

const Add = ({
  isOpen,
  onClose,
  item,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  item: any;
}) => {
  const [fromValue, setFromValue] = useState<string>('');
  const [fromBalance, setFromBalance] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toBalance, setToBalance] = useState<string>('');
  const [lpTotal, setLpTotal] = useState<string>('');
  const [lpValue, setLpValue] = useState<string>('');

  const { currentAccount } = useAccount();
  const { contract: exContract } = useExchange(item.exchange);
  const { contract: fromContract } = useToken(item.from);
  const { contract: toContract } = useToken(item.to);
  const lpBalance = useLPtokenBalance();
  const { contract: lpContract } = useLPtokenContract();
  const [isLoading, setIsLoading] = useState(false);

  const { read: readFrom } = useContractQuery({ contract: fromContract, method: 'erc20,balanceOf' });
  const { read: readTo } = useContractQuery({ contract: toContract, method: 'erc20,balanceOf' });
  const { read: readTotalSupply } = useContractQuery({ contract: lpContract, method: 'totalSupply' });
  const { read: readEstimatedAddLiquidity } = useContractQuery({
    contract: exContract,
    method: 'estimatedAddLiquidity'
  });
  const { excute } = useContractTx({
    title: 'Add Liquidity',
    contract: exContract,
    method: 'addLiquidity'
  });
  const { excute: approveFrom } = useContractTx({
    title: 'Approve',
    contract: fromContract,
    method: 'erc20,approve'
  });
  const { excute: approveTo } = useContractTx({
    title: 'Approve',
    contract: toContract,
    method: 'erc20,approve'
  });

  const [fromPrice, toPrice] = useMemo(() => {
    const totalFrom = Number(fromValue) + Number(item.from_token_pool);
    const totalTo = Number(toValue) + Number(item.to_token_pool);

    return [(totalTo / totalFrom).toFixed(10), (totalFrom / totalTo).toFixed(10)];
  }, [fromValue, toValue, item.from_token_pool, item.to_token_pool]);

  useEffect(() => {
    if (isOpen && readFrom) {
      readFrom(currentAccount)
        .then((result) => {
          result && setFromBalance(formatAmount(result as any, item.from_decimals));
        })
        .catch(() => {
          setFromBalance('');
        });
    }
  }, [isOpen, readFrom, currentAccount, item.from_decimals]);

  useEffect(() => {
    if (isOpen && readTotalSupply) {
      readTotalSupply()
        .then((result) => {
          result && setLpTotal(formatAmount(result as any, 18));
        })
        .catch(() => {
          setLpTotal('');
        });
    }
  }, [isOpen, readTotalSupply]);

  useEffect(() => {
    if (isOpen && readTotalSupply) {
      readEstimatedAddLiquidity(
        parseAmount(fromValue || '0', item.from_decimals),
        parseAmount(toValue || '0', item.to_decimals)
      )
        .then((result) => {
          setLpValue(formatAmount((result as any) || 0, 18));
        })
        .catch((error) => {
          console.error(error);
          setLpValue('');
        });
    }
  }, [isOpen, fromValue, toValue, readEstimatedAddLiquidity, item.from_decimals, item.to_decimals]);

  useEffect(() => {
    if (isOpen && readTo) {
      readTo(currentAccount)
        .then((result) => {
          result && setToBalance(formatAmount(result as any, item.to_decimals));
        })
        .catch(() => {
          setToBalance('');
        });
    }
  }, [isOpen, readTo, currentAccount, item.to_decimals]);

  const close = () => {
    setFromValue('');
    setToValue('');
    onClose();
  };

  const submit = () => {
    const from = parseAmount(fromValue || '0', item.from_decimals);
    const to = parseAmount(toValue || '0', item.to_decimals);

    setIsLoading(true);
    approveFrom([item.exchange, from])
      .then(() => {
        return approveTo([item.exchange, to]);
      })
      .then(() => {
        return excute([from, to]);
      })
      .then(() => {
        onSubmit();
        close();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Add Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel textStyle='form-label'>
              <span>From</span>
              {fromBalance ? <span>Balance: {fromBalance}</span> : null}
            </FormLabel>
            <InputGroup>
              <InputNumber value={fromValue} onChange={setFromValue} />
              <InputRightElement
                width={40}
                children={
                  <Flex width='full' alignItems='center' mr={2} flexDirection='row-reverse'>
                    <Text
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: 'lg',
                        lineHeight: 'short',
                        background: '#E1E9FF',
                        borderRadius: '4px',
                        minWidth: '74px',
                        padding: '5px 0',
                        textAlign: 'center',
                        left: '42px'
                      }}
                    >
                      {item.from_name}
                    </Text>
                    <Box mr='1' mt='1'>
                      <IdentityIcon value={item.from} />
                    </Box>
                  </Flex>
                }
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel textStyle='form-label'>
              <span>To</span>
              {toBalance ? <span>Balance: {toBalance}</span> : null}
            </FormLabel>
            <InputGroup>
              <InputNumber value={toValue} onChange={setToValue} />
              <InputRightElement
                width={40}
                children={
                  <Flex width='full' alignItems='center' mr={2} flexDirection='row-reverse'>
                    <Text
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: 'lg',
                        lineHeight: 'short',
                        background: '#E1E9FF',
                        borderRadius: '4px',
                        minWidth: '74px',
                        padding: '5px 0',
                        textAlign: 'center',
                        left: '42px'
                      }}
                    >
                      {item.to_name}
                    </Text>
                    <Box mr='1' mt='1'>
                      <IdentityIcon value={item.to} />
                    </Box>
                  </Flex>
                }
              />
            </InputGroup>
          </FormControl>
          <Flex>
            <FormControl mr={8}>
              <FormLabel textStyle='form-label'>Price and pool share</FormLabel>
              <Flex
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #ABB4D0',
                  p: 4,
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Center>
                    <Text sx={{ fontSize: 'sm', fontWeight: 'medium' }}>{fromPrice}</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>
                      {item.to_name} per {item.from_name}
                    </Text>
                  </Center>
                </Box>
                <Box>
                  <Center>
                    <Text sx={{ fontSize: 'sm', fontWeight: 'medium' }}>{toPrice}</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>
                      {item.from_name} per {item.to_name}
                    </Text>
                  </Center>
                </Box>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel textStyle='form-label'>
                <span>LP Tokens</span>
                <span>Balance: {lpBalance && formatAmount(lpBalance, 18)}</span>
              </FormLabel>
              <Flex
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #ABB4D0',
                  p: 4,
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Center>
                    <Text sx={{ fontSize: 'sm', fontWeight: 'medium' }}>{lpValue}</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>You will receive</Text>
                  </Center>
                </Box>
                <Box>
                  <Center>
                    <Text sx={{ fontSize: 'sm', fontWeight: 'medium' }}>{lpTotal}</Text>
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>Total supply</Text>
                  </Center>
                </Box>
              </Flex>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isDisabled={!toValue || !fromValue} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Add;
