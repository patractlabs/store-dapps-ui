import { GameInfo } from './index';
const now = new Date();
const tomorrow = new Date().setDate(now.getDate() + 1);
const tableData: Array<GameInfo> = [
  {
    id: '8',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: false,
      account: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
      choice: null,
        value: 1,

    },
    joiner: null,
    winner: null,
    status: 'wait_for_join'
  },
  {
    id: '7',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: false,
      account: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
      choice: null,
      value: 1
    },
    joiner: null,
    winner: null,
    status: 'wait_for_join'
  },
  {
    id: '6',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: null,
      revealed: false,
      account: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
      choice: null,
      value: 1,
    },
    joiner: {
      choice: 'Scissors',
      account: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
      value: 1
    },
    winner: null,
    expireTime: tomorrow,
    status: 'wait_for_reveal'
  },
  {
    id: '5',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: true,
      account: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
      choice: 'Scissors',
      value: 1,
    },
    joiner: {
      choice: 'Scissors',
      account: '5Cr56wqg25wVVMKsSQr16SrYiNb9u7Jn6wpNYC25ZmaUoxPG',
      value: 1
    },
    winner: 'even',
    status: 'closed'
  },
  {
    id: '4',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: true,
      account: '5Cr56wqg25wVVMKsSQr16SrYiNb9u7Jn6wpNYC25ZmaUoxPG',
      choice: 'Rock',
      value: 1,
    },
    joiner: {
      choice: 'Scissors',
      account: 'E5PpL…j3grz',
      value: 1
    },
    winner: 'creater',
    status: 'closed'
  },
  {
    id: '3',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: false,
      account: 'E5PpL…j3grz',
      choice: null,
      value: 1,
    },
    joiner: {
      choice: 'Scissors',
      account: 'E5PpL…j3grz',
      value: 1
    },
    winner: null,
    status: 'expired'
  },
  {
    id: '2',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: false,
      account: 'E5PpL…j3grz',
      choice: 'Paper',
      value: 1,
    },
    joiner: {
      choice: 'Scissors',
      account: 'E5PpL…j3grz',
      value: 1
    },
    winner: 'joiner',
    status: 'punished'
  },
  {
    id: '1',
    creater: {
      hash: '0x23f071a3d536d74…',
      salt: '0x23f071a…3d536d74',
      revealed: false,
      account: 'E5PpL…j3grz',
      choice: null,
      value: 1,
    },
    joiner: {
      choice: 'Scissors',
      account: 'E5PpL…j3grz',
      value: 1
    },
    winner: null,
    status: 'waiting',
    expireTime: tomorrow
  },
];

export default tableData;
