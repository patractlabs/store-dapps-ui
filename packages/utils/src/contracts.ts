const isPara = process.env.REACT_APP_CHAIN === 'para';

export const PatraPK = isPara
  ? '3djs7v6bJVuNtVuAE7K6YqUMGfskhcLC4wJYQXNRnZudkNUt'
  : '3djs7v6bJVuNtVuAE7K6YqUMGfskhcLC4wJYQXNRnZudkNUt';
export const PatraPixel = isPara
  ? '3bpKVMrmYnCKFXXnu1MFA4wJeUVZEyxbNC3Sce4APxJi1hwg'
  : '3gR2tVyU1e3KDpJkudncpZEVLT5UgnU5uNmwEjcY2k1Zrykh';
export const PatraLottery = isPara
  ? '3f2BQHDzk66iEXPphx9BUq8iZva3cejTvZmiyZQHZ2ZKu7Ac'
  : '3f2BQHDzk66iEXPphx9BUq8iZva3cejTvZmiyZQHZ2ZKu7Ac';
export const PatraSwap = isPara
  ? '3d6zXxdiHUXFwg958yS5BeugwYSFxxR8xEBXGUqtqLfR5jfm'
  : '3e5Cm76isZx7TQUaPoU3QFYVap6RpmkmiEiYwmLFfwbLedPv';
export const PatraMaker = isPara
  ? '3cWch7CFRyhsryFNSBYuK86jpvUYsz4tu1FXXXjbmR4AiDmL'
  : '3hCyvCT9odKjfuqK1U85cr99sjkuWqahGVQBEyFhehpNzFts';
export const USDT = isPara
  ? '3faReJaqfwFLsEzozvJwRxGEwN17y3AyLzJChPdbBtktAc6o'
  : '3eJxTJ8zs2S6n1j2WrL6z3dmTuWVJUQBud5NMtm9mVS972KK';
export const JBTC = isPara
  ? '3dKmLie6EcEDJPyn1UEnKdZCBysNsmv2NNu2FzAAntkYYrVB'
  : '3cRrRg3xwR6hoGCD9X7E5r3nkt8wC8eKoJfMp8LSW9zeKcEm';
export const JETH = isPara
  ? '3btyVk6ahBJS7syGu4GYAWmyfZAVHMrUeRLdL1kadKerv4i6'
  : '3coksxrL2q5yvkqsjqDRmQdKqRfyB2akVX1sVzY73DE2dvnF';
export const DAI = isPara
  ? '3h2crvKgDDbtQGHACsfrpFp2pF959dkQptGqw1rGrfqSeQcF'
  : '3dSBGtq2W7xK1yz545wu6d9HvKxEpMWM4DwizXsZ6gWb346f';
export const EMPTY = isPara
  ? '3bU9io5UzZju4XX4YqscpRv3ocieRmNXuTQQzmiq3ETgKhGV'
  : '3bU9io5UzZju4XX4YqscpRv3ocieRmNXuTQQzmiq3ETgKhGV';

export const abis = {
  Erc20fixed: isPara ? require('./para-contracts/erc20_fixed.json') : require('./contracts/erc20_fixed.json'),
  Erc20issue: isPara ? require('./para-contracts/erc20_issue.json') : require('./contracts/erc20_issue.json'),
  Exchange: isPara ? require('./para-contracts/exchange.json') : require('./contracts/exchange.json'),
  Exchange2: isPara ? require('./para-contracts/exchange2.json') : require('./contracts/exchange2.json'),
  Factory: isPara ? require('./para-contracts/factory.json') : require('./contracts/factory.json'),
  Lpt: isPara ? require('./para-contracts/lpt.json') : require('./contracts/lpt.json'),
  Patralottery: isPara ? require('./para-contracts/patralottery.json') : require('./contracts/patralottery.json'),
  Patramaker: isPara ? require('./para-contracts/patramaker.json') : require('./contracts/patramaker.json'),
  Patrapixel: isPara ? require('./para-contracts/patrapixel.json') : require('./contracts/patrapixel.json'),
  Patrapk: isPara ? require('./para-contracts/patrapk.json') : require('./contracts/patrapk.json')
};

export const wsUrl = isPara ? 'wss://ws.jupiter.patract-westend.patract.cn' : 'wss://jupiter-poa.elara.patract.io';

export const trait = isPara ? '' : 'iErc20,';
