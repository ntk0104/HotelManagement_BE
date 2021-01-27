import express from 'express';

module.exports = ({ itemHandlers, intercept, itemValidation }) => {
  const router = express.Router();
  // Get service items
  router.get('/', intercept(itemHandlers, 'getServiceItems'));
  // create service items
  // router.get('/', intercept(itemHandlers, 'getServiceItems'));
  return router;
};
