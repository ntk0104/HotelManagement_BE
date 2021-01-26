import express from 'express';

module.exports = ({ globalHandlers, intercept, globalValidation }) => {
  const router = express.Router();
  // Get master data
  router.get('/', intercept(globalHandlers, 'getMasterData'));
  return router;
};
