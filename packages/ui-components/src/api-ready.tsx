import React from 'react';
import { useApi, useAccount } from '@patract/react-hooks';
import { Center, Spinner } from '@chakra-ui/react';

const AccountReady: React.FC = ({ children }) => {
  return <>{children}</>;
};

export const ApiReady: React.FC = ({ children }) => {
  const { isApiReady } = useApi();

  if (!isApiReady)
    return (
      <Center sx={{ mt: 'calc(40vh - 60px)' }}>
        <Spinner color='blue.500' />
      </Center>
    );

  return <AccountReady>{children}</AccountReady>;
};
