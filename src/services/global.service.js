import models from '../models';

export default class TransactionService {
  async getAllMasterData() {
    const serviceItems = await models.ServiceItem.findAll({
      where: { isDeleted: false, availableQuanity: { $gt: 0 } },
      order: ['createdAt'],
    });
    const rooms = await models.Room.findAll();
    return { serviceItems, rooms };
  }
}
