export type Account = {
  address: string;
};

export type AccountProps = {
  accountList: Account[];
  currentAccount?: Account;
  setCurrentAccount: (account: Account) => void;
};
