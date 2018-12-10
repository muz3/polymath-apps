import { PolymathContext } from '~/types';

type PrimitiveMethod = (...args: any[]) => Promise<any>;

export interface TxMethod {
  args: any[];
  method: PrimitiveMethod | TransactionBase<any>;
}

export interface HigherLevelTransaction<Args = any> {
  new (args: Args, context: PolymathContext): TransactionBase<Args>;
}

function isHigherLevelTransaction(
  transaction: any
): transaction is HigherLevelTransaction {
  if (transaction.type) {
    return true;
  }
  return false;
}

export class TransactionBase<P> {
  public static type = 'HLT';
  protected args: P;
  protected context: PolymathContext;
  private transactions: TxMethod[] = [];
  // TODO @RafaelVidaurre: Temporary for typeguarding

  constructor(args: P, context: PolymathContext) {
    this.args = args;
    this.context = context;
  }

  /**
   * Mandatory method that builds a list of transactions that will be
   * run.
   */
  public async prepareTransactions(): Promise<void> {}

  public async prepare(): Promise<TxMethod[]> {
    await this.prepareTransactions();
    // NOTE @RafaelVidaurre: Should return some structure with listeners
    // and other public api functionality that might be useful

    // TODO @RafaelVidaurre: Mutate state cache to recursively called
    // child txns
    return this.transactions;
  }

  protected addTransaction(Method: HigherLevelTransaction | PrimitiveMethod) {
    return async (...args: any[]) => {
      let transactions: TxMethod[];
      // If method is a HLT, instanciate it with the right context and args
      if (isHigherLevelTransaction(Method)) {
        const method = new Method(args[0], this.context);
        transactions = await method.prepare();
      } else {
        transactions = [
          {
            method: Method,
            args,
          },
        ];
      }

      this.transactions = [...this.transactions, ...transactions];
    };
  }
}
