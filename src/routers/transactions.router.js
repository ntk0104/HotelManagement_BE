import express from 'express';

module.exports = ({ transactionsHandlers, intercept, transactionsValidation }) => {
  const router = express.Router();
  // Add transaction
  router.post('/', transactionsValidation.createTransaction(), intercept(transactionsHandlers, 'createTransaction'));
  // Get transaction with filter ability
  router.get('/', intercept(transactionsHandlers, 'getTransaction'));
  return router;
};
