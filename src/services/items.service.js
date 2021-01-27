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
    await models.ServiceItem.update(req.body, { where: { id: itemId } });
    const updatedItem = models.ServiceItem.findOne({ where: { id: itemId } });
    return updatedItem;
  }
}
