import BigNumber from 'bignumber.js';
import { TransactionObject } from 'web3/eth/types';
import { PolyTokenAbi } from './abis/PolyTokenAbi';
import { PolyTokenFaucetAbi } from './abis/PolyTokenFaucetAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { GenericContract } from '~/LowLevel/types';

export interface AllowanceArgs {
  tokenOwner: string;
  spender: string;
}

export interface GetTokensArgs {
  amount: BigNumber;
  recipient: string;
}

export interface BalanceOfArgs {
  address: string;
}

export interface ApproveArgs {
  spender: string;
  amount: BigNumber;
}

interface PolyTokenContract extends GenericContract {
  methods: {
    getTokens: (
      amount: BigNumber,
      recipient: string
    ) => TransactionObject<boolean>;
    balanceOf: (address: string) => TransactionObject<string>;
    allowance: (
      tokenOwner: string,
      spender: string
    ) => TransactionObject<string>;
    approve: (spender: string, amount: BigNumber) => TransactionObject<boolean>;
  };
}

export class PolyToken extends Contract<PolyTokenContract> {
  private isTestnet: boolean;

  constructor({ address, context }: { address: string; context: Context }) {
    const isTestnet = context.isTestnet();
    const abi = isTestnet ? PolyTokenFaucetAbi.abi : PolyTokenAbi.abi;
    super({ address, abi, context });
    this.isTestnet = isTestnet;
    this.getTokens = this.getTokens.bind(this);
    this.approve = this.approve.bind(this);
  }

  public async getTokens({ amount, recipient }: GetTokensArgs) {
    if (!this.isTestnet) {
      throw new Error('Cannot call "getTokens" in mainnet');
    }
    return () =>
      this.contract.methods
        .getTokens(amount, recipient)
        .send({ from: this.context.account });
  }

  public async balanceOf({ address }: BalanceOfArgs) {
    return this.contract.methods.balanceOf(address).call();
  }

  public async allowance({ tokenOwner, spender }: AllowanceArgs) {
    return this.contract.methods.allowance(tokenOwner, spender).call();
  }

  public async approve({ spender, amount }: ApproveArgs) {
    return () =>
      this.contract.methods
        .approve(spender, amount)
        .send({ from: this.context.account });
  }
}
