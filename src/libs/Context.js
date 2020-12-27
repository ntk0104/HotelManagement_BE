export default class Context {
  constructor(req) {
    this.req = req;
  }

  resolve(name) {
    this.req.container.resolve(name);
  }
}
