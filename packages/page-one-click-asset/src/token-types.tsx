import { abis } from '@patract/utils';

export enum TokenType {
  erc20_1 = 'ERC20_1',
  erc20_2 = 'ERC20_2'
}

export const TokenTypeName = {
  [TokenType.erc20_1]: 'Fixed Supply ERC20',
  [TokenType.erc20_2]: 'Mintable ERC20'
};

export const getTokenTypeName = (type: TokenType) => {
  return TokenTypeName[type];
};

export const getTokenAbi = (type: TokenType | string) => {
  if (type === TokenType.erc20_1) {
    return abis.Erc20fixed;
  } else if (type === TokenType.erc20_2) {
    return abis.Erc20issue;
  } else if (type === abis.Erc20fixed.source.hash) {
    return abis.Erc20fixed;
  } else if (type === abis.Erc20issue.source.hash) {
    return abis.Erc20issue;
  } else {
    throw new Error('Unexpected');
  }
};
