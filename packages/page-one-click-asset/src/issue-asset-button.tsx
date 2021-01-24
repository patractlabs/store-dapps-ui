import { useModal } from '@patract/react-hooks';
import { Button } from '@patract/ui-components';
import React from 'react';
import { IssueAssetModal } from './issus-asset-modal';

type IssueAssetButtonProps = {
  contractAddress: string;
  updateView: () => void;
};

export const IssueAssetButton: React.FC<IssueAssetButtonProps> = ({ contractAddress, updateView }) => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button size='sm' onClick={onOpen}>
        Issue
      </Button>
      <IssueAssetModal updateView={updateView} contractAddress={contractAddress} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
