import { Procedure } from './Procedure';
import { TaxWithholding } from '~/types';
import { types } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';

export interface Args {
  symbol: string;
  maturityDate: Date;
  expiryDate: Date;
  amount: BigNumber;
  checkpointId: number;
  name: string;
  excludedAddresses?: string[];
  taxWithholdings?: TaxWithholding[];
}

export class CreateEtherDividendDistribution extends Procedure<Args> {
  public type = types.ProcedureTypes.CreateEtherDividendDistribution;
  public async prepareTransactions() {
    const {
      symbol,
      maturityDate,
      expiryDate,
      amount,
      checkpointId,
      name,
      excludedAddresses,
      taxWithholdings = [],
    } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });
    const etherModule = await securityToken.getEtherDividendModule();

    if (!etherModule) {
      throw new Error(
        "Dividend modules haven't been enabled. Did you forget to call .enableDividendModules()?"
      );
    }

    await this.addTransaction(etherModule.createDividend, {
      tag: types.PolyTransactionTags.CreateEtherDividendDistribution,
    })({
      maturityDate,
      expiryDate,
      amount,
      checkpointId,
      name,
      excludedAddresses,
    });

    if (taxWithholdings.length > 0) {
      const investors: string[] = [];
      const percentages: number[] = [];

      taxWithholdings.forEach(({ address, percentage }) => {
        investors.push(address);
        percentages.push(percentage);
      });

      await this.addTransaction(etherModule.setWithholding, {
        tag: types.PolyTransactionTags.SetEtherTaxWithholding,
      })({ investors, percentages });
    }
  }
}
