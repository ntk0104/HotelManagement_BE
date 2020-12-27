import express from 'express';

module.exports = ({ roomsHandlers, intercept, roomsValidation }) => {
  const router = express.Router();
  // List All Rooms
  router.get('/', intercept(roomsHandlers, 'getAllRooms'));
  // Edit Room
  router.put('/:id', roomsValidation.hasRoleAdmin(), roomsValidation.editRoom(), intercept(roomsHandlers, 'editRoom'));

  return router;
};
