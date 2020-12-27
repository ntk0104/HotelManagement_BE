import Joi from 'joi';
import AbstractValidation from './abstract.validation';

export default class RoomsValidation extends AbstractValidation {
  editRoom = () => (req, res, next) => this.validate(req.body, editRoomSchema)(req, res, next);

  hasRoleAdmin = () => (req, res, next) => this.isAdmin(req.user)(req, res, next);
}

const editRoomSchema = Joi.object({
  overnightPrice: Joi.number().integer().min(0).required(),
  roomName: Joi.string().min(1).required(),
  roomType: Joi.number().integer().min(0).required(),
  shorttimePrice_Air: Joi.number().integer().min(0).required(),
  shorttimePrice_Fan: Joi.number().integer().min(0).required(),
});
