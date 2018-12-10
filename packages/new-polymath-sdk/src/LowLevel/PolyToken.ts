import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { types } from '@polymathnetwork/new-shared';
import { blockchainStub } from '~/lowLevel/blockchainStub';
import { TransactionObject } from 'web3/eth/types';
import { PolyTokenAbi } from './abis/PolyTokenAbi';
import { PolyTokenFaucetAbi } from './abis/PolyTokenFaucetAbi';
import { Contract } from './Contract';

interface PolyTokenContract {
  methods: {
    getTokens: () => TransactionObject<boolean>;
    balanceOf: (address: types.Address) => TransactionObject<BigNumber>;
    allowance: (spender: types.Address) => TransactionObject<BigNumber>;
    approve: (
      tokenowner: types.Address,
      spender: types.Address,
      amount: BigNumber
    ) => TransactionObject<boolean>;
  };
}

export class PolyToken extends Contract<PolyTokenContract> {
  constructor({
    address,
    web3,
    isTestnet,
  }: {
    address: types.Address;
    web3: Web3;
    isTestnet: boolean;
  }) {
    const abi = isTestnet ? PolyTokenFaucetAbi.abi : PolyTokenAbi.abi;
    super({ address, web3, abi });
  }
  public async getTokens(address: types.Address, amount: BigNumber) {
    const balances = blockchainStub[address].balances;
    balances[types.Tokens.Poly] = balances[types.Tokens.Poly].plus(amount);
  }

  public async balanceOf(address: types.Address) {
    return this.contract.methods.balanceOf(address).call();
  }

  public async allowance(spender: types.Address) {
    return this.contract.methods.allowance(spender).call();
  }

  public async approve(
    tokenOwner: types.Address,
    spender: types.Address,
    amount: BigNumber
  ) {
    return this.contract.methods.approve(tokenOwner, spender, amount).call();
  }
}
