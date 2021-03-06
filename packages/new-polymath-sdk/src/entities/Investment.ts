import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { serialize, unserialize } from '../utils';

interface UniqueIdentifiers {
  symbol: string;
  stoModuleId: string;
  index: number;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { symbol, stoModuleId, index } = identifiers;

  return (
    typeof symbol === 'string' &&
    typeof stoModuleId === 'string' &&
    typeof index === 'number'
  );
}

interface Params extends UniqueIdentifiers {
  symbol: string;
  address: string;
  tokenAmount: BigNumber;
  investedFunds: BigNumber;
}

export class Investment extends Entity {
  public static generateId({
    symbol,
    stoModuleId,
    index,
  }: UniqueIdentifiers) {
    return serialize('investment', {
      symbol,
      stoModuleId,
      index,
    });
  }

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong investment ID format.');
    }

    return unserialized;
  }

  public uid: string;

  public symbol: string;

  public stoModuleId: string;

  public address: string;

  public index: number;

  public tokenAmount: BigNumber;

  public investedFunds: BigNumber;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      symbol,
      stoModuleId,
      address,
      index,
      tokenAmount,
      investedFunds,
    } = params;

    this.symbol = symbol;
    this.stoModuleId = stoModuleId;
    this.address = address;
    this.index = index;
    this.tokenAmount = tokenAmount;
    this.investedFunds = investedFunds;
    this.uid = Investment.generateId({
      symbol,
      stoModuleId,
      index,
    });
  }

  public toPojo() {
    const {
      uid,
      symbol,
      stoModuleId,
      address,
      index,
      tokenAmount,
      investedFunds,
    } = this;

    return {
      uid,
      symbol,
      stoModuleId,
      address,
      index,
      tokenAmount,
      investedFunds,
    };
  }
}
