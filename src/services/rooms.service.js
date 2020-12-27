import models from '../models';

export default class RoomService {
  async getRooms() {
    const listRooms = await models.Room.findAll();
    return listRooms;
  }

  async editRoom(req) {
    const roomId = req.params.id;
    await models.Room.update(req.body, { where: { id: roomId } });
    const updatedRoom = models.Room.findOne({ where: { id: roomId } });
    return updatedRoom;
  }
}
