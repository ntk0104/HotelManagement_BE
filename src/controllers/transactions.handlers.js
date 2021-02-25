import moment from 'moment';

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

  async handleUpdateTransaction(req, res) {
    const updatedBody = {
      ...req.body,
      updatedAt: moment.now(),
      updatedBy: req.user.email
    };
    const updatedTransaction = await this.transactionsService.updateTransaction(req, updatedBody);
    return res.success(updatedTransaction);
  }
}
