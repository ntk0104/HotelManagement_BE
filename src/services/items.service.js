import models from '../models';

export default class ItemService {
  async getServiceItems() {
    const serviceItems = await models.ServiceItem.findAll();
    return serviceItems;
  }

  async createItem(newItem) {
    const serviceItems = await models.ServiceItem.create(newItem);
    return serviceItems;
  }

  async editItem(req) {
    const itemId = req.params.id;
    const serviceItems = await models.ServiceItem.findOne({ where: { id: itemId } });
    if (!serviceItems) {
      throw ErrorCode.ITEM_NOT_EXISTED;
    }
    await models.ServiceItem.update(req.body, { where: { id: itemId } });
    const updatedItem = models.ServiceItem.findOne({ where: { id: itemId } });
    return updatedItem;
  }

  async deleteItem(req) {
    const itemId = req.params.id;
    const selectedItem = await models.ServiceItem.destroy({ where: { id: itemId } });
    if (!selectedItem) {
      throw ErrorCode.ITEM_NOT_EXISTED;
    }
    return selectedItem;
  }
}
