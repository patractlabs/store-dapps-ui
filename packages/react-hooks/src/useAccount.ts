import { AccountContext } from '@patract/react-components/account/account-context';
import type { AccountProps } from '@patract/react-components/account/types';
import { useContext } from 'react';

export function useAccount(): AccountProps {
  return useContext(AccountContext);
}
