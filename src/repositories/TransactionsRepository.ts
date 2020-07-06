/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulater, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulater.income += Number(transaction.value);
            break;

          case 'outcome':
            accumulater.outcome += Number(transaction.value);

          // eslint-disable-next-line no-fallthrough
          default:
            break;
        }
        return accumulater;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
