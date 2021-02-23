import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useEffect, useMemo } from 'react';

const deployedContractSubscription = gql`
  query Contracts($signer: String!, $offset: Int, $codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 5
      offset: $offset
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: {
          signer: { _eq: $signer }
          _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }]
        }
      }
    ) {
      id
      args
      extrinsic {
        args
      }
    }
    Events_aggregate(
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: {
          signer: { _eq: $signer }
          _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }]
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const deployedContractSubscriptionWs = gql`
  subscription Contracts($signer: String!, $offset: Int, $codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 5
      offset: $offset
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: {
          signer: { _eq: $signer }
          _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }]
        }
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

const publicDeployedContractSubscription = gql`
  query Contracts($signer: String!, $offset: Int, $codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 5
      offset: $offset
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: {
          signer: { _neq: $signer }
          _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }]
        }
      }
    ) {
      id
      args
      extrinsic {
        args
      }
    }
    Events_aggregate(
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: {
          signer: { _neq: $signer }
          _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }]
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const publicDeployedContractSubscriptionWs = gql`
  subscription Contracts($signer: String!, $offset: Int, $codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 5
      offset: $offset
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: {
          signer: { _neq: $signer }
          _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }]
        }
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

export const useQueryContracts = (
  isPublic: boolean,
  signer: string,
  codeHash1: string,
  codeHash2: string,
  offset: number
) => {
  const gql = useMemo(() => {
    return isPublic ? publicDeployedContractSubscription : deployedContractSubscription;
  }, [isPublic]);

  const gql2 = useMemo(() => {
    return isPublic ? publicDeployedContractSubscriptionWs : deployedContractSubscriptionWs;
  }, [isPublic]);

  const { data: subData } = useSubscription(gql2, {
    variables: {
      signer,
      offset,
      codeHash1: {
        code_hash: codeHash1
      },
      codeHash2: {
        code_hash: codeHash2
      }
    }
  });

  const { data, loading, refetch } = useQuery(gql, {
    variables: {
      signer,
      offset,
      codeHash1: {
        code_hash: codeHash1
      },
      codeHash2: {
        code_hash: codeHash2
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [subData]);

  return { data, loading };
};
