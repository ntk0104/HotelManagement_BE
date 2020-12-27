// ASK16: tat ca cac loai error code deu define o day hay sao? - yes tru loi he thong 5xx
module.exports = {
  // register
  EXISTED_EMAIL: {
    code: 4001,
    message: 'EMAIL_EXISTED',
  },
  // login
  UNAUTHORIZED_EMAIL: {
    code: 4100,
    message: 'INCORRECT_EMAIL',
  },
  UNAUTHORIZED_EMAIL_OR_PASSWORD: {
    code: 4101,
    message: 'INCORRECT_EMAIL_OR_PASSWORD',
  },
  // common
  INVALID_TOKEN: {
    code: 4002,
    message: 'INVALID_TOKEN',
  },
  FORBIDDEN_TOKEN: {
    code: 4300,
    message: 'FORBIDDEN_TOKEN',
  },
  PERMISSION_DENIED: {
    code: 4103,
    message: 'PERMISSION_DENIED',
  },
  INVALID_PARAMETER: {
    code: 4000,
    message: 'INVALID_PARAMETER',
  },
  DATA_NOT_FOUND: {
    code: 4400,
    message: 'DATA_NOT_FOUND',
  },
};
