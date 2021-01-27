import models from '../models';

export default class ItemService {
  async getServiceItems(req) {
    const serviceItems = await models.ServiceItem.findAll();
    return serviceItems;
  }
}
