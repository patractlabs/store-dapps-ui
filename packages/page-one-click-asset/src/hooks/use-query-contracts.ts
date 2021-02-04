import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useMemo } from 'react';

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

const allDeployedContractSubscription = gql`
  query Contracts($offset: Int, $codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 5
      offset: $offset
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
    Events_aggregate(
      where: {
        section: { _eq: "contracts" }
        method: { _eq: "Instantiated" }
        extrinsic: { _or: [{ args: { _contains: $codeHash1 } }, { args: { _contains: $codeHash2 } }] }
      }
    ) {
      aggregate {
        count
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

  return useSubscription(gql, {
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
};
