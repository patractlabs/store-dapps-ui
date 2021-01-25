import { useToast } from '@patract/react-hooks';
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
  SimpleGrid
} from '@patract/ui-components';
import { SignMessageModal, SignMessageFields } from '@patract/react-components';
import { Abi } from '@polkadot/api-contract';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMintableContract } from './hooks';
import { getTokenAbi } from './token-types';
import { checkContractParams } from '@patract/utils';

export type IssueAssetModalProps = {
  isOpen: boolean;
  onClose(): void;
  updateView(): void;
  contractAddress: string;
};

enum ModalView {
  create = 'create',
  confirm = 'confirm'
}

export type FieldValues = {
  issueAmount: string;
};

export const IssueAssetModal: React.FC<IssueAssetModalProps> = ({ contractAddress, isOpen, onClose, updateView }) => {
  const { control, errors, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { issueAmount: '' }
  });

  const { contract, abiJSON } = useMintableContract(contractAddress);
  const [modalView, setModalView] = useState<ModalView>(ModalView.create);
  const [confirmValues, setConfirmValues] = useState<SignMessageFields | null>(null);
  const toast = useToast();

  const deploy = handleSubmit((data) => {
    try {
      checkContractParams(abiJSON, 'issue', [data.issueAmount]);
      setConfirmValues([
        {
          label: 'Issue Amount',
          content: data.issueAmount
        }
      ]);
      setModalView(ModalView.confirm);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Issue Asset',
        description: error?.message,
        status: 'error'
      });
      setConfirmValues(null);
    }
  });

  const resetView = () => {
    setModalView(ModalView.create);
    reset();
    setConfirmValues(null);
  };

  const handleClose = () => {
    updateView();
    resetView();
    onClose();
  };

  return modalView === ModalView.create ? (
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
              <Button width='full' size='lg' colorScheme='blue' onClick={deploy}>
                Issue
              </Button>
            </FormControl>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : modalView === ModalView.confirm && confirmValues ? (
    <SignMessageModal
      fields={confirmValues}
      isOpen={true}
      method={'issue'}
      title={'Confrim Issue'}
      contract={contract}
      onBack={resetView}
      onClose={handleClose}
    />
  ) : null;
};
