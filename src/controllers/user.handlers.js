export default class UserHandler {
  constructor({ userService }) {
    this.userService = userService;
  }

  async register(req, res) {
    const params = req.body;
    const userData = await this.userService.create(params);
    return res.success(userData);
  }

  async login(req, res) {
    const params = req.body;
    const userData = await this.userService.login(params);
    return res.success(userData);
  }
}
