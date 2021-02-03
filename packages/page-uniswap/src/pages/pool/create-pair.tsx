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
import React, { useEffect, useState } from 'react';
import { useFactoryContract } from '../../hooks/useFactoryContract';
import { useContractTx } from '@patract/react-hooks';

const CreatePair = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { contract } = useFactoryContract();
  const { excute } = useContractTx({ title: 'Create Pair', contract, method: 'factory,createExchange' });

  const close = () => {
    setFrom('');
    setTo('');
    onClose();
  };

  const submit = () => {
    setIsLoading(true);
    excute([from, to, null])
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
              <Input
                value={from}
                onChange={(event) => {
                  setFrom(event.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>To</FormLabel>
              <Input
                value={to}
                onChange={(event) => {
                  setTo(event.target.value);
                }}
              />
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isDisabled={!to || !from} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePair;
