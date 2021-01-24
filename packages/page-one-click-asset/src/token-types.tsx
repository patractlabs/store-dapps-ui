import Erc20fixed from './contracts/erc20fixed.json';
import Erc20mintable from './contracts/erc20mintable.json';

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
    return Erc20fixed;
  } else if (type === TokenType.erc20_2) {
    return Erc20mintable;
  } else if (type === Erc20fixed.source.hash) {
    return Erc20fixed;
  } else if (type === Erc20mintable.source.hash) {
    return Erc20mintable;
  } else {
    throw new Error('Unexpected');
  }
};
