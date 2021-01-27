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
}
