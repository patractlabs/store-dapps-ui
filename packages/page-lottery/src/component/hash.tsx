//! Pretties hash
import React from 'react';
import { Tooltip } from '@patract/ui-components';

export const Hash: React.FC<{ hash: string }> = ({ hash }) => {
  return <Tooltip label={hash}>{`${hash.slice(0, 4)}...${hash.slice(30, 32)}`}</Tooltip>;
};
