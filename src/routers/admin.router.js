import express from 'express';

module.exports = ({ adminHandlers, intercept, adminValidation }) => {
  const router = express.Router();
  // List All Users
  router.get('/users', adminValidation.getAllUsers(), intercept(adminHandlers, 'getAllUsers'));

  return router;
};
