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
  Stack
} from '@patract/ui-components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMintableContract } from './hooks';

export type IssueAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
  updateView(): void;
  contractAddress: string;
};

export type FieldValues = {
  issueAmount: string;
};

export const IssueAssetModal: React.FC<IssueAssetModalProps> = ({ contractAddress, isOpen, onClose, updateView }) => {
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { issueAmount: '' }
  });

  const { contract } = useMintableContract(contractAddress);
  const { excute, isLoading } = useContractTx({ title: 'Issue Asset', contract, method: 'iErc20.mint' });

  const submit = handleSubmit(async (data) => {
    await excute([data.issueAmount]);
    handleClose();
  });

  const resetView = () => {
    reset();
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
                <Button colorScheme='blue' isLoading={isLoading} onClick={submit}>
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
