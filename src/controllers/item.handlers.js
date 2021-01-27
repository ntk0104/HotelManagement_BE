export default class ItemHandler {
  constructor({ itemService }) {
    this.itemService = itemService;
  }

  async getServiceItems(req, res) {
    const serviceItemsData = await this.itemService.getServiceItems(req);
    return res.success(serviceItemsData);
  }
}
