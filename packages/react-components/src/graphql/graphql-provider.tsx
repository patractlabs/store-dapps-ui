import { ApolloProvider } from '@apollo/react-hooks';
import React, { useMemo } from 'react';
import { createClient } from './client';

const linkConfig = {
  http: 'http://192.168.50.10:8080/v1/graphql',
  ws: 'ws://192.168.50.10:8080/v1/graphql'
};

export const GraphqlProvider: React.FC = ({ children }) => {
  const client = useMemo(() => {
    return createClient(linkConfig);
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
