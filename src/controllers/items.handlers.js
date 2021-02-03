import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

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
      id: uuidv4(),
      createdAt: moment.now(),
      updatedAt: moment.now(),
      createdBy: req.user.email
    };
    const createdItem = await this.itemsService.createItem(newItem);
    return res.success(createdItem);
  }

  async handleEditItem(req, res) {
    const updatedItem = {
      ...req.body,
      updatedAt: moment.now(),
      updatedBy: req.user.email
    };
    const editedItem = await this.itemsService.editItem(req, updatedItem);
    return res.success(editedItem);
  }

  async handleDeleteItem(req, res) {
    const deletedBody = {
      ...req.body,
      updatedAt: moment.now(),
      updatedBy: req.user.email,
      isDeleted: true
    };
    const deletedItem = await this.itemsService.deleteItem(req, deletedBody);
    return res.success(deletedItem);
  }
}
