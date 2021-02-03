import models from '../models';

export default class ItemService {
  async getServiceItems() {
    const serviceItems = await models.ServiceItem.findAll({
      order: ['createdAt'],
    });
    return serviceItems;
  }

  async createItem(newItem) {
    const serviceItems = await models.ServiceItem.create(newItem);
    return serviceItems;
  }

  async editItem(req, body) {
    const itemId = req.params.id;
    const serviceItems = await models.ServiceItem.findOne({ where: { id: itemId } });
    if (!serviceItems) {
      throw ErrorCode.ITEM_NOT_EXISTED;
    }
    await models.ServiceItem.update(body, { where: { id: itemId } });
    const updatedItem = models.ServiceItem.findOne({ where: { id: itemId } });
    return updatedItem;
  }

  async deleteItem(req, body) {
    const itemId = req.params.id;
    const serviceItems = await models.ServiceItem.findOne({ where: { id: itemId } });
    if (!serviceItems) {
      throw ErrorCode.ITEM_NOT_EXISTED;
    }
    await models.ServiceItem.update(body, { where: { id: itemId } });
    const deletedItem = models.ServiceItem.findOne({ where: { id: itemId } });
    return deletedItem;
  }
}
