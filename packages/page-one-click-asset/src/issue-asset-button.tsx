import { useModal } from '@patract/react-hooks';
import { Button } from '@patract/ui-components';
import React from 'react';
import { IssueAssetModal } from './issus-asset-modal';

type IssueAssetButtonProps = {
  contractAddress: string;
  updateView: () => void;
  tokenDecimals: number;
};

export const IssueAssetButton: React.FC<IssueAssetButtonProps> = ({ tokenDecimals, contractAddress, updateView }) => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button size='sm' onClick={onOpen}>
        Issue
      </Button>
      <IssueAssetModal tokenDecimals={tokenDecimals} updateView={updateView} contractAddress={contractAddress} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
