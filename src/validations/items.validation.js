import Joi from 'joi';
import AbstractValidation from './abstract.validation';

export default class ItemsValidation extends AbstractValidation {
  hasRoleAdmin = () => (req, res, next) => this.isAdmin(req.user)(req, res, next);

  createItem = () => (req, res, next) => this.validate(req.body, createItemSchema)(req, res, next);

  editItem = () => (req, res, next) => this.validate(req.body, createItemSchema)(req, res, next);
}

const createItemSchema = Joi.object({
  name: Joi.string(),
  unitPrice: Joi.number().min(1000),
  availableQuanity: Joi.number().integer(),
  isDeleted: Joi.boolean().optional()
});
