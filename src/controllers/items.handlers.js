import { v4 as uuidv4 } from 'uuid';

export default class ItemsHandler {
  constructor({ itemsService }) {
    this.itemsService = itemsService;
  }

  async handleGetServiceItems(req, res) {
    const serviceItemsData = await this.itemsService.getServiceItems(req);
    return res.success(serviceItemsData);
  }

  async handleCreateItem(req, res) {
    const newItem = {
      ...req.body,
      id: uuidv4()
    };
    const createdItem = await this.itemsService.createItem(newItem);
    return res.success(createdItem);
  }

  async handleEditItem(req, res) {
    const editedItem = await this.itemsService.editItem(req);
    return res.success(editedItem);
  }
}
