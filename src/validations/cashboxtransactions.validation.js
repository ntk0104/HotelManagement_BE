import Joi from 'joi';
import AbstractValidation from './abstract.validation';

export default class CashboxTransactionsValidation extends AbstractValidation {
  createTransaction = () => (req, res, next) => this.validate(req.body, createCashBoxTransactionSchema)(req, res, next);
}

const createCashBoxTransactionSchema = Joi.object({
  type: Joi.boolean().required(),
  note: Joi.string().allow(null, ''),
  changedCash: Joi.number().integer(),
  isChecked: Joi.boolean().optional(),
  baselineAmount: Joi.number().integer().optional()
});
