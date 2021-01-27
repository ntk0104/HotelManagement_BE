export default class ItemsHandler {
  constructor({ itemsService }) {
    this.itemsService = itemsService;
  }

  async handleGetServiceItems(req, res) {
    const serviceItemsData = await this.itemsService.getServiceItems(req);
    console.log('HERE: ', req);
    return res.success(serviceItemsData);
  }
}
