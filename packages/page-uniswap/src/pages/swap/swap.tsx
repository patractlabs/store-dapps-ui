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
import { useApprove } from '../../hooks/useApprove';

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
  }, [inputOption, createToken]);

  const inputApprove = useApprove(inputContract?.contract as any);

  const createExchange = useExchangeFactory();
  const { currentAccount } = useAccount();
  const { contract } = useFactoryContract();
  const [exchangeInfo, setExchangeInfo] = useState<any>(null);

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

  const swapInputOutput = () => {
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
    if (exchangeContract?.contract?.contract) {
      contractQuery(currentAccount, exchangeContract.contract.contract, 'exchangeInfo').then((data: any) => {
        setExchangeInfo(data);
      });
    } else {
      setExchangeInfo(null);
    }
  }, [contractQuery, exchangeContract, currentAccount]);

  useEffect(() => {
    if (exchangeContract) {
      const isExchange2 = exchangeContract.contract.contract.abi.json.contract.name === 'exchange2';

      if (inputValue) {
        if (exchangeContract.from === inputOption.address) {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            isExchange2 ? 'getTokenToDotInputPrice' : 'getFromSwapToInputPrice',
            parseAmount(inputValue, inputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedOutput(formatAmount(result, outputOption.decimals));
              setMethod(!isExchange2 ? 'swapFromToInput' : 'swapTokenToDotInput');
            })
            .catch(() => {
              setMethod('');
            });

          return;
        } else {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            isExchange2 ? 'getDotToTokenInputPrice' : 'getToSwapFromInputPrice',
            parseAmount(inputValue, inputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedOutput(formatAmount(result, outputOption.decimals));
              setMethod(!isExchange2 ? 'swapToFromInput' : 'swapDotToTokenInput');
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
            isExchange2 ? 'getTokenToDotOutputPrice' : 'getFromSwapToOutputPrice',
            parseAmount(outputValue, outputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedInput(formatAmount(result, inputOption.decimals));
              setMethod(!isExchange2 ? 'swapFromToOutput' : 'swapTokenToDotOutput');
            })
            .catch(() => {
              setMethod('');
            });
          return;
        } else {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            isExchange2 ? 'getDotToTokenOutputPrice' : 'getToSwapFromOutputPrice',
            parseAmount(outputValue, outputOption.decimals)
          )
            .then((result: any) => {
              result && setEstimatedInput(formatAmount(result, inputOption.decimals));
              setMethod(!isExchange2 ? 'swapToFromOutput' : 'swapDotToTokenOutput');
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
    if (
      method === 'swapFromToOutput' ||
      method === 'swapToFromOutput' ||
      method === 'swapTokenToDotOutput' ||
      method === 'swapDotToTokenOutput'
    ) {
      setIsLoading(true);
      inputApprove(exchangeContract.address)
        .then(() => {
          if (method === 'swapDotToTokenOutput') {
            return excute(
              [parseAmount(outputValue, outputOption.decimals)],
              parseAmount(String((Number(estimatedInput) * 1.1).toFixed(inputOption.decimals)), inputOption.decimals)
            );
          } else {
            return excute([parseAmount(outputValue, outputOption.decimals)]);
          }
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
      inputApprove(exchangeContract.address)
        .then(() => {
          if (method === 'swapDotToTokenInput') {
            return excute([], parseAmount(inputValue, inputOption.decimals));
          } else {
            return excute([parseAmount(inputValue, inputOption.decimals)]);
          }
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
              contract: createExchange(result, inputOption.address, outputOption.address)
            });
          } else {
            return readExchangeAddress(outputOption.address, inputOption.address).then((result) => {
              if (result) {
                setExchangeContract({
                  from: outputOption.address,
                  to: inputOption.address,
                  address: result,
                  contract: createExchange(result, inputOption.address, outputOption.address)
                });
              } else {
                setExchangeContract(null);
              }
            });
          }
        })
        .catch((error) => {
          console.log('catch');

          setExchangeContract(null);
        })
        .finally(() => {
          console.log('finally');
          setExchangeContractLoading(false);
        });
    }
  }, [readExchangeAddress, inputOption, outputOption, createExchange]);

  const message = useMemo(() => {
    if (exchangeInfo && inputOption && outputOption) {
      const fromPool = Number(formatAmount(exchangeInfo.from_token_pool, exchangeInfo.from_decimals));
      const toPool = Number(formatAmount(exchangeInfo.to_token_pool, exchangeInfo.to_decimals));

      if (inputOption.symbol === exchangeInfo.from_symbol) {
        if (Number(inputValue) > fromPool || Number(estimatedInput) > fromPool) {
          return `${inputOption.symbol} exceeds pool limit`;
        } else if (Number(outputValue) > toPool || Number(estimatedOutput) > toPool) {
          return `${outputOption.symbol} exceeds pool limit`;
        }
      } else if (inputOption.symbol === exchangeInfo.to_symbol) {
        if (Number(inputValue) > toPool || Number(estimatedInput) > toPool) {
          return `${inputOption.symbol} exceeds pool limit`;
        } else if (Number(outputValue) > fromPool || Number(estimatedOutput) > fromPool) {
          return `${outputOption.symbol} exceeds pool limit`;
        }
      }
    }

    return '';
  }, [exchangeInfo, inputOption, outputOption, inputValue, estimatedInput, outputValue, estimatedOutput]);

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
              withBalance
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
            onClick={swapInputOutput}
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
              withBalance
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
            ) : message ? (
              <Text color='red.500'>{message}</Text>
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
              isDisabled={!exchangeContract || !method || !!message}
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
