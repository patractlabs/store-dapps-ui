import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const deployedContractSubscription = gql`
  subscription Contracts($signer: String!, $codeHash1: jsonb!, $codeHash2: jsonb!) {
    Events(
      order_by: { blockNumber: desc }
      limit: 20
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

export const useQueryContracts = (signer: string, codeHash1: string, codeHash2: string) => {
  return useSubscription(deployedContractSubscription, {
    variables: {
      signer,
      codeHash1: {
        code_hash: codeHash1
      },
      codeHash2: {
        code_hash: codeHash2
      }
    }
  });
};
