import express from 'express';

module.exports = ({ transactionHandlers, intercept, transactionValidation }) => {
  const router = express.Router();
  // Add transaction
  router.post('/', transactionValidation.createTransaction(), intercept(transactionHandlers, 'createTransaction'));
  // Get transaction with filter ability
  router.get('/', intercept(transactionHandlers, 'getTransaction'));
  return router;
};
