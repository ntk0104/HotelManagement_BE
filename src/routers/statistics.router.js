import express from 'express';

module.exports = ({ statisticsHandlers, intercept, statisticsValidation }) => {
  const router = express.Router();
  // get report by selected date
  router.get('/', intercept(statisticsHandlers, 'handleGetDateReport'));
  return router;
};
