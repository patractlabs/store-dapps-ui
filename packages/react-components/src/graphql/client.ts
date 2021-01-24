import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';

type Config = {
  http: string;
  ws: string;
};

export const createClient = (config: Config) => {
  const cache = new InMemoryCache();

  const { http, ws } = config;

  const httpLink = new HttpLink({
    uri: http
  });

  const wsLink = new WebSocketLink({
    uri: ws,
    options: {
      reconnect: true
    }
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink as any,
    httpLink
  );

  return new ApolloClient({
    cache,
    link,
    connectToDevTools: true
  });
};
