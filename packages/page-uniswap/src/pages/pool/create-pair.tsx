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
  Input
} from '@patract/ui-components';
import React, { useMemo, useState } from 'react';
import { useFactoryContract } from '../../hooks/useFactoryContract';
import InputAddressSelect from '../../components/input-address-select';
import { useContractTx } from '@patract/react-hooks';
import { useQueryContracts } from '../../hooks/use-query-contracts';
import { Abi } from '@polkadot/api-contract';
import { hexToU8a, compactAddLength } from '@polkadot/util';
import { abis, EMPTY } from '@patract/utils';

const CreatePair = React.memo(
  ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { contract } = useFactoryContract();
    const { excute } = useContractTx({ title: 'Create Pair', contract, method: 'factory,createExchange' });
    const { excute: createDot } = useContractTx({
      title: 'Create Pair',
      contract,
      method: 'factory,createExchangeWithDot'
    });

    const { data } = useQueryContracts();

    const contracts = useMemo(() => {
      try {
        const res = data.Events.map((x: any) => [x.extrinsic.args.code_hash, x.args[1], x.extrinsic]);
        const result: any = [];
        for (const [code_hash, contract, extrinsic] of res) {
          if (!extrinsic?.args?.data) return;
          if (code_hash === abis.Erc20fixed.source.hash) {
            const abi = new Abi(abis.Erc20fixed);
            try {
              const constructor = abi.decodeConstructor(compactAddLength(hexToU8a(extrinsic.args.data)));
              const data = constructor.args.map((a) => a.toJSON());
              result.push({
                token_name: data[data.length - 3],
                token_symbol: data[data.length - 2],
                token_decimals: data[data.length - 1],
                contract,
                code_hash
              });
            } catch {}
          }
          if (code_hash === abis.Erc20issue.source.hash) {
            const abi = new Abi(abis.Erc20fixed);
            try {
              const constructor = abi.decodeConstructor(compactAddLength(hexToU8a(extrinsic.args.data)));
              const data = constructor.args.map((a) => a.toJSON());
              result.push({
                token_name: data[data.length - 3],
                token_symbol: data[data.length - 2],
                token_decimals: data[data.length - 1],
                contract,
                code_hash
              });
            } catch {}
          }
        }
        return result;
      } catch (error) {
        return [];
      }
    }, [data]);

    const contractsWithDot = useMemo(() => {
      return [
        {
          token_name: 'Polkadot',
          token_symbol: 'DOT',
          token_decimals: 10,
          contract: EMPTY
        }
      ].concat(contracts || []);
    }, [contracts]);

    const close = () => {
      setFrom('');
      setTo('');
      onClose();
    };

    const submit = () => {
      setIsLoading(true);
      let method: any;
      if (to === '') {
        method = createDot([from, from]);
      } else {
        method = excute([from, to, null]);
      }
      method
        .then(() => {
          close();
          onSubmit();
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    return (
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
          <ModalHeader>Create a pair</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid column={1} spacing='8'>
              <FormControl>
                <FormLabel>From</FormLabel>
                <InputAddressSelect
                  options={contracts}
                  value={from}
                  onChangeValue={setFrom}
                  onChangeOption={(option) => {
                    setFrom(option.contract || '');
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>To</FormLabel>
                <InputAddressSelect
                  options={contractsWithDot}
                  hasDefault
                  value={to}
                  onChangeValue={setTo}
                  onChangeOption={(option) => {
                    if (option.contract === EMPTY) {
                      setTo('');
                    } else {
                      setTo(option.contract || '');
                    }
                  }}
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter py={8}>
            <Stack direction='row' spacing={4} justifyContent='flex-end'>
              <Button isDisabled={!from} isLoading={isLoading} colorScheme='blue' onClick={submit}>
                Submit
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default CreatePair;
