import React from 'react';
import type { AccountProps } from './types';

const AccountContext: React.Context<AccountProps> = React.createContext(({} as unknown) as AccountProps);
const AccountConsumer: React.Consumer<AccountProps> = AccountContext.Consumer;
const AccountProvider: React.Provider<AccountProps> = AccountContext.Provider;

export default AccountContext;

export { AccountContext, AccountConsumer, AccountProvider };
