export default class AdminHandler {
  constructor({ adminService }) {
    this.adminService = adminService;
  }

  async getAllUsers(req, res) {
    const userData = await this.adminService.getUsers();
    return res.success(userData);
  }
}
