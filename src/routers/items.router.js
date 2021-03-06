import express from 'express';

module.exports = ({ itemsHandlers, intercept, itemsValidation }) => {
  const router = express.Router();
  // Get service items
  router.get('/', intercept(itemsHandlers, 'handleGetServiceItems'));
  // create service items
  router.post('/', itemsValidation.hasRoleAdmin(), itemsValidation.createItem(), intercept(itemsHandlers, 'handleCreateItem'));
  // Edit Service items
  router.put('/:id', itemsValidation.hasRoleAdmin(), itemsValidation.editItem(), intercept(itemsHandlers, 'handleEditItem'));
  // delete item
  router.delete('/:id', itemsValidation.hasRoleAdmin(), intercept(itemsHandlers, 'handleDeleteItem'));
  return router;
};
