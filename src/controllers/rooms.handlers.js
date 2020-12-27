export default class RoomHandler {
  constructor({ roomsService }) {
    this.roomsService = roomsService;
  }

  async getAllRooms(req, res) {
    const roomsData = await this.roomsService.getRooms();
    return res.success(roomsData);
  }

  async editRoom(req, res) {
    const roomsData = await this.roomsService.editRoom(req);
    return res.success(roomsData);
  }
}
