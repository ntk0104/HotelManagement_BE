const error = {
  log(err, req, res, next) {
    return next(err);
  },

  handler(err, req, res, next) {
    switch (err.name) {
    case 'AuthenticationError':
    case 'OAuth2Error':
      res.status(400).json({
        error: {
          code: err.code || err.status,
          message: err.message,
          codeError: err.codeError
        }
      });
      break;
    default:
      res.status(400).json({
        error: {
          code: +err.code > 10000 ? 4000 : err.code,
          message: convertDBMessage(err.detail || (err.nativeError && err.nativeError.detail))
              || err.message,
          codeError: err.codeError
        }
      });
      next(err);
      break;
    }
  }
};

module.exports = (app) => {
  app.use(error.log, error.handler);
};

const convertDBMessage = (message) => {
  const isExist = /^Key/.test(message) && / already exists.$/.test(message);
  const roleAssignUser = /^Key/.test(message) && / is still referenced from table "UserRole".$/.test(message);

  if (isExist) {
    const key = message.split(/[()]/)[1].replace(/"/gi, '');
    return `This ${Constants.REQUIRED_FIELD[key] || key} has already existed.`;
  }

  if (roleAssignUser) {
    return 'This role has been assigned to a user.';
  }

  return message;
};
