export default class GlobalHandler {
  constructor({ globalService }) {
    this.globalService = globalService;
  }

  async getMasterData(req, res) {
    const masterData = await this.globalService.getAllMasterData(req);
    return res.success(masterData);
  }
}
