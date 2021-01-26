import Joi from 'joi';
import AbstractValidation from './abstract.validation';

export default class TransactionValidation extends AbstractValidation {
  createTransaction = () => (req, res, next) => this.validate(req.body, createTransactionSchema)(req, res, next);
}

const createTransactionSchema = Joi.object({
  selectedRoomID: Joi.string().required(),
  timeIn: Joi.date().timestamp('unix').required(),
  sectionType: Joi.string().required(),
  sectionRoomType: Joi.string().required(),
  userNote: Joi.string().allow(null, ''),
  isPaidAdvance: Joi.boolean().required(),
  totalPaidAdvance: Joi.number().integer()
});
