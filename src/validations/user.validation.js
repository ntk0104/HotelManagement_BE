import Joi from 'joi';
import AbstractValidation from './abstract.validation';

export default class UserValidation extends AbstractValidation {
  register = () => (req, res, next) => this.validate(req.body, registerSchema)(req, res, next);

  login = () => (req, res, next) => this.validate(req.body, registerSchema)(req, res, next);
}

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).max(20).required(),
});
