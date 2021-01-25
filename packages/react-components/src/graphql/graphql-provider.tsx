import { ApolloProvider } from '@apollo/react-hooks';
import React, { useMemo } from 'react';
import { createClient } from './client';

const linkConfig = {
  http: 'https://wss://ws.staging.jupiter.patract.cn/v1/graphql',
  ws: 'wss://wss://ws.staging.jupiter.patract.cn/v1/graphql'
};

export const GraphqlProvider: React.FC = ({ children }) => {
  const client = useMemo(() => {
    return createClient(linkConfig);
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
