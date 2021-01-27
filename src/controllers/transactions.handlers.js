export default class TransactionsHandler {
  constructor({ transactionsService }) {
    this.transactionsService = transactionsService;
  }

  async createTransaction(req, res) {
    const transactionData = await this.transactionsService.create(req);
    return res.success(transactionData);
  }

  async getTransaction(req, res) {
    const filteredTransaction = await this.transactionsService.getList(req);
    return res.success(filteredTransaction);
  }
}
