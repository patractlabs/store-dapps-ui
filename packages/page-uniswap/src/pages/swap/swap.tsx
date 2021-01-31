import { useContractQuery, contractQuery, useAccount, useContractTx } from '@patract/react-hooks';
import { formatAmount, parseAmount } from '@patract/utils';
import {
  Box,
  Button,
  Center,
  Spinner,
  Flex,
  FormControl,
  Icon,
  PageLayout,
  PageMain,
  Text
} from '@patract/ui-components';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { FiRepeat } from 'react-icons/fi';
import Header from '../../components/header';
import InputSelect from '../../components/input-select';
import { useFactoryContract } from '../../hooks/useFactoryContract';
import { useExchangeFactory } from '../../hooks/useExchangeFactory';
import { useTokenFactory } from '../../hooks/useTokenFactory';

export const Swap = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputOption, setInputOption] = useState<any>(null);
  const [outputValue, setOutputValue] = useState<string>('');
  const [outputOption, setOutputOption] = useState<any>(null);
  const [exchangeContract, setExchangeContract] = useState<any>(null);
  const [exchangeContractLoading, setExchangeContractLoading] = useState(false);
  const [estimatedInput, setEstimatedInput] = useState<string | null>(null);
  const [estimatedOutput, setEstimatedOutput] = useState<string | null>(null);
  const [isSwapPrice, setIsSwapPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState('');
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);
  const { excute } = useContractTx({ title: 'Swap', contract: exchangeContract?.contract?.contract, method });
  const createToken = useTokenFactory();

  const inputContract = useMemo(() => {
    try {
      if (!inputOption?.address) return null;
      return createToken(inputOption?.address);
    } catch {
      return null;
    }
  }, [inputOption]);

  const { excute: inputApprove } = useContractTx({
    title: 'Approve',
    contract: inputContract?.contract as any,
    method: 'erc20,approve'
  });

  const createExchange = useExchangeFactory();
  const { currentAccount } = useAccount();
  const { contract } = useFactoryContract();

  const { read: readExchangeAddress } = useContractQuery({ contract, method: 'factory,getExchange' });

  const swapPrice = useMemo(() => {
    if (!isSwapPrice) {
      if (inputValue && estimatedOutput && Number(inputValue as any) !== 0) {
        //@ts-ignore
        return (estimatedOutput / inputValue).toFixed(10);
      } else if (outputValue && estimatedInput && Number(estimatedInput as any) !== 0) {
        //@ts-ignore
        return (outputValue / estimatedInput).toFixed(10);
      } else {
        return null;
      }
    } else {
      if (inputValue && estimatedOutput && Number(estimatedOutput as any) !== 0) {
        //@ts-ignore
        return (inputValue / estimatedOutput).toFixed(10);
      } else if (outputValue && estimatedInput && Number(outputValue as any) !== 0) {
        //@ts-ignore
        return (estimatedInput / outputValue).toFixed(10);
      } else {
        return null;
      }
    }
  }, [isSwapPrice, inputValue, estimatedOutput, outputValue, estimatedInput]);

  const swapInputOuteput = () => {
    if (estimatedInput === null) {
      setInputOption(outputOption);
      setOutputOption(inputOption);
      setOutputValue(inputValue);
      setInputValue('');
      setEstimatedInput('');
      setEstimatedOutput(null);
    } else if (estimatedOutput === null) {
      setInputOption(outputOption);
      setOutputOption(inputOption);
      setInputValue(outputValue);
      setOutputValue('');
      setEstimatedInput(null);
      setEstimatedOutput('');
    }
  };

  useEffect(() => {
    if (exchangeContract) {
      if (inputValue) {
        if (exchangeContract.from === inputOption.address) {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getFromSwapToInputPrice',
            parseAmount(inputValue, inputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedOutput(formatAmount(result, outputOption.decimals));
              setMethod('swapFromToInput');
            })
            .catch(() => {
              setMethod('');
            });

          return;
        } else {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getToSwapFromInputPrice',
            parseAmount(inputValue, inputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedOutput(formatAmount(result, outputOption.decimals));
              setMethod('swapToFromInput');
            })
            .catch(() => {
              setMethod('');
            });
          return;
        }
      } else if (outputValue) {
        if (exchangeContract.from === inputOption.address) {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getFromSwapToOutputPrice',
            parseAmount(outputValue, outputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedInput(formatAmount(result, inputOption.decimals));
              setMethod('swapFromToOutput');
            })
            .catch(() => {
              setMethod('');
            });
          return;
        } else {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getToSwapFromOutputPrice',
            parseAmount(outputValue, outputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedInput(formatAmount(result, inputOption.decimals));
              setMethod('swapToFromOutput');
            })
            .catch(() => {
              setMethod('');
            });
          return;
        }
      }
      setMethod('');
    } else {
      setEstimatedInput(null);
      setEstimatedOutput(null);
      setMethod('');
    }
  }, [exchangeContract, currentAccount, inputValue, outputValue, inputOption, outputOption]);

  const submit = () => {
    if (method === 'swapFromToOutput' || method === 'swapToFromOutput') {
      setIsLoading(true);
      inputApprove([exchangeContract.address, parseAmount(estimatedInput as any, inputOption.decimals)])
        .then(() => {
          return excute([parseAmount(outputValue, outputOption.decimals)]);
        })
        .finally(() => {
          setIsLoading(false);
          setEstimatedInput(null);
          setEstimatedOutput(null);
          setInputValue('');
          setOutputValue('');
          forceUpdate();
        });
    } else {
      setIsLoading(true);
      inputApprove([exchangeContract.address, parseAmount(inputValue, inputOption.decimals)])
        .then(() => {
          return excute([parseAmount(inputValue, inputOption.decimals)]);
        })
        .finally(() => {
          setIsLoading(false);
          setEstimatedInput(null);
          setEstimatedOutput(null);
          setInputValue('');
          setOutputValue('');
          forceUpdate();
        });
    }
  };

  useEffect(() => {
    if (inputOption && outputOption) {
      setExchangeContractLoading(true);
      readExchangeAddress(inputOption.address, outputOption.address)
        .then((result) => {
          if (result) {
            return setExchangeContract({
              from: inputOption.address,
              to: outputOption.address,
              address: result,
              contract: createExchange(result)
            });
          } else {
            return readExchangeAddress(outputOption.address, inputOption.address).then((result) => {
              if (result) {
                setExchangeContract({
                  from: outputOption.address,
                  to: inputOption.address,
                  address: result,
                  contract: createExchange(result)
                });
              } else {
                setExchangeContract(null);
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setExchangeContract(null);
        })
        .finally(() => {
          setExchangeContractLoading(false);
        });
    }
  }, [readExchangeAddress, inputOption, outputOption]);

  return (
    <Box>
      <Center mt='10'>
        <Box
          maxW='2xl'
          width='2xl'
          background='white'
          border='1px solid'
          borderColor='gray.200'
          borderRadius='20px'
          p={[10, 20]}
        >
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              defaultOptionIndex={0}
              value={estimatedInput === null ? inputValue : estimatedInput}
              option={inputOption}
              onChangeOption={(value) => {
                setInputOption(value);
              }}
              withBalance='erc20,balanceOf'
              signal={signal}
              onChangeValue={(value) => {
                setInputValue(value);
                setOutputValue('');
                if (value) {
                  setEstimatedInput(null);
                  setEstimatedOutput('');
                } else {
                  setEstimatedInput(null);
                  setEstimatedOutput(null);
                }
              }}
              label={`From${estimatedInput === null ? '' : ' (estimated)'}`}
            />
          </FormControl>
          <Icon
            as={FiRepeat}
            onClick={swapInputOuteput}
            sx={{
              position: 'absolute',
              display: 'inline-block',
              padding: '4px',
              w: 7,
              h: 7,
              color: 'blue.500',
              transform: 'rotate(90deg)',
              borderRadius: '2px',
              mt: '-10px',
              zIndex: 1,
              cursor: 'pointer',
              mx: 'auto',
              left: 0,
              right: 0
            }}
          />
          <FormControl sx={{ mb: '16px' }}>
            <InputSelect
              defaultOptionIndex={1}
              value={estimatedOutput === null ? outputValue : estimatedOutput}
              option={outputOption}
              onChangeOption={setOutputOption}
              withBalance='erc20,balanceOf'
              signal={signal}
              onChangeValue={(value) => {
                setInputValue('');
                setOutputValue(value);
                if (value) {
                  setEstimatedInput('');
                  setEstimatedOutput(null);
                } else {
                  setEstimatedInput(null);
                  setEstimatedOutput(null);
                }
              }}
              label={`To${estimatedOutput === null ? '' : ' (estimated)'}`}
            />
          </FormControl>
          <Box
            sx={{
              border: '1px solid #ABB4D0',
              borderRadius: '4px',
              p: '10px 18px',
              mb: '24px'
            }}
          >
            {exchangeContractLoading ? (
              <Spinner size='sm' color='blue.500' />
            ) : !exchangeContract ? (
              <Text color='red.500'>Invalid trading pairs</Text>
            ) : (
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Text sx={{ color: '#999999', display: 'inline-block' }}>Price</Text>
                <Center>
                  {swapPrice ? (
                    !isSwapPrice ? (
                      <Text sx={{ display: 'inline-block' }}>
                        {swapPrice} {outputOption.symbol} per {inputOption.symbol}
                      </Text>
                    ) : (
                      <Text sx={{ display: 'inline-block' }}>
                        {swapPrice} {inputOption.symbol} per {outputOption.symbol}
                      </Text>
                    )
                  ) : null}

                  <Icon
                    as={FiRepeat}
                    w={5}
                    h={5}
                    sx={{ ml: '15px', color: 'brand.primary', cursor: 'pointer' }}
                    onClick={() => setIsSwapPrice(!isSwapPrice)}
                  />
                </Center>
              </Flex>
            )}
          </Box>
          <FormControl>
            <Button
              isDisabled={!exchangeContract || !method}
              isLoading={isLoading}
              width='full'
              size='lg'
              colorScheme='blue'
              onClick={submit}
            >
              Swap
            </Button>
          </FormControl>
        </Box>
      </Center>
    </Box>
  );
};
