import AbstractValidation from './abstract.validation';

export default class AdminValidation extends AbstractValidation {
  getAllUsers = () => (req, res, next) => this.isAdmin(req.user)(req, res, next);
}
