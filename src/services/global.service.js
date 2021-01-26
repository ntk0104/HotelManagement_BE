import models from '../models';

export default class TransactionService {
  async getAllMasterData(req) {
    const serviceItems = await models.ServiceItem.findAll();
    const rooms = await models.Room.findAll();
    return { serviceItems, rooms };
  }
}
