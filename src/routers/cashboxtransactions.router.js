import express from 'express';

module.exports = ({ cashboxtransactionsHandlers, intercept, cashboxtransactionsValidation }) => {
  const router = express.Router();
  // Add transaction
  router.post('/', cashboxtransactionsValidation.createTransaction(), intercept(cashboxtransactionsHandlers, 'handleCreateTransaction'));
  // get current cash in cashbox
  router.get('/currentmoney', intercept(cashboxtransactionsHandlers, 'handleGetCurrentMoney'));
  // get list changed cash transaction from last chốt tiền
  router.get('/recently', intercept(cashboxtransactionsHandlers, 'handleGetRecentlyTransactions'));
  return router;
};
