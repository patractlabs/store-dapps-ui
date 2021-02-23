import { useContractTx } from '@patract/react-hooks';
import {
  Button,
  FormControl,
  FormLabel,
  InputNumberController,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Input
} from '@patract/ui-components';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { parseAmount } from '@patract/utils';
import { useMintableContract } from './hooks';

export type IssueAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
  updateView(): void;
  tokenDecimals: number;
  contractAddress: string;
};

export type FieldValues = {
  issueAmount: string;
};

export const IssueAssetModal: React.FC<IssueAssetModalProps> = ({
  tokenDecimals,
  contractAddress,
  isOpen,
  onClose,
  updateView
}) => {
  const { control, handleSubmit, reset, errors } = useForm<FieldValues>({
    defaultValues: { issueAmount: '' }
  });

  const [address, setAddress] = useState('');
  const { contract } = useMintableContract(contractAddress);
  const { excute, isLoading } = useContractTx({ title: 'Issue Asset', contract, method: 'mint' });

  const submit = handleSubmit(async (data) => {
    if(!address) return
    await excute([address, parseAmount(data.issueAmount, tokenDecimals)]);
    handleClose();
  });

  const resetView = () => {
    reset();
    setAddress('');
  };

  const handleClose = () => {
    updateView();
    resetView();
    onClose();
  };

  return (
    <Modal motionPreset='none' variant='common' isOpen={isOpen} autoFocus={false} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Issue Asset</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={8}>
          <SimpleGrid column={1} spacing='8'>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>To Address</FormLabel>
              <Input
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                }}
              />
            </FormControl>
            <FormControl as='fieldset'>
              <FormLabel as='legend'>Issue Amount</FormLabel>
              <InputNumberController
                control={control}
                name='issueAmount'
                pattern='^[0-9]{0,16}$'
                rules={{ required: true }}
              />
            </FormControl>
            <FormControl>
              <Stack direction='row' spacing={4} justifyContent='flex-end'>
                <Button
                  disabled={!!errors.issueAmount || !address}
                  colorScheme='blue'
                  isLoading={isLoading}
                  onClick={submit}
                >
                  Issue
                </Button>
              </Stack>
            </FormControl>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
