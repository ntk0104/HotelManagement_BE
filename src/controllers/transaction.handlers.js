export default class TransactionHandler {
  constructor({ transactionService }) {
    this.transactionService = transactionService;
  }

  async createTransaction(req, res) {
    const transactionData = await this.transactionService.create(req);
    return res.success(transactionData);
  }

  async getTransaction(req, res) {
    const filteredTransaction = await this.transactionService.getList(req);
    return res.success(filteredTransaction);
  }
}
