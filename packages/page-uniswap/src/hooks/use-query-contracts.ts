import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useEffect, useMemo } from 'react';
import Erc20fixed from '@patract/utils/contracts/erc20_fixed.json';
import Erc20mintable from '@patract/utils/contracts/erc20_issue.json';

const publicDeployedContractSubscriptionWs = gql`
  subscription Contracts($codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 1000
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: { _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }] }
      }
    ) {
      id
      args
      extrinsic {
        args
      }
    }
  }
`;

export const useQueryContracts = () => {
  const gql2 = useMemo(() => {
    return publicDeployedContractSubscriptionWs;
  }, []);

  return useSubscription(gql2, {
    variables: {
      codeHash1: {
        code_hash: Erc20fixed.source.hash
      },
      codeHash2: {
        code_hash: Erc20mintable.source.hash
      }
    }
  });
};
