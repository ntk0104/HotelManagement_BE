import express from 'express';

module.exports = ({ userHandlers, intercept, userValidation }) => {
  const router = express.Router();
  router.post('/register', userValidation.register(), intercept(userHandlers, 'register'));
  router.post('/login', userValidation.login(), intercept(userHandlers, 'login'));

  return router;
};
