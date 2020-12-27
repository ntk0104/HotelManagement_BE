import Joi from 'joi';
import _ from 'lodash';

export default class Validation {
  validate(obj, schema) {
    return (req, res, next) => {
      const { error } = Joi.validate(obj, schema);
      if (error) {
        return res.status(400).send({
          error: {
            ...ErrorCode.INVALID_PARAMETER,
            message: _.get(error, 'details[0].message'),
          },
        });
      }
      return next();
    };
  }

  isAdmin(reqUser) {
    return (req, res, next) => {
      if (reqUser.userType === 'admin') {
        return next();
      }
      return res.status(403).json({
        error: ErrorCode.FORBIDDEN_TOKEN,
      });
    };
  }
}
