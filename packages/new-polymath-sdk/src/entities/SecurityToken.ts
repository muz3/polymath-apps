import { typeHelpers } from '@polymathnetwork/new-shared';
import { Polymath } from '~/Polymath';
import { Entity } from '~/entities/Entity';

interface Params {
  symbol: string;
  name: string;
}

export class SecurityToken extends Entity {
  public symbol: string;
  public name: string;

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    this.symbol = params.symbol;
    this.name = params.name;
  }

  public enableDividendModules(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['enableDividendModules'],
      SecurityToken
    >
  ) {
    return this.polyClient.enableDividendModules({
      ...args,
      symbol: this.symbol,
    });
  }

  public createCheckpoint(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['createCheckpoint'],
      SecurityToken
    >
  ) {
    return this.polyClient.createCheckpoint({ ...args, symbol: this.symbol });
  }

  public distributePolyDividends(
    args: typeHelpers.ArgsWithoutEntityProps<
      Polymath['distributePolyDividends'],
      SecurityToken
    >
  ) {
    return this.polyClient.distributePolyDividends({
      ...args,
      symbol: this.symbol,
      name: this.name,
    });
  }
}