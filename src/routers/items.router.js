import express from 'express';

module.exports = ({ itemsHandlers, intercept, itemsValidation }) => {
  const router = express.Router();
  // Get service items
  router.get('/', intercept(itemsHandlers, 'handleGetServiceItems'));
  // create service items
  // router.get('/', intercept(itemHandlers, 'getServiceItems'));
  return router;
};
