export default class CashboxTransactionsHandler {
  constructor({ cashboxtransactionsService }) {
    this.cashboxtransactionsService = cashboxtransactionsService;
  }

  async handleCreateTransaction(req, res) {
    const transactionData = await this.cashboxtransactionsService.create(req);
    return res.success(transactionData);
  }

  async handleGetCurrentMoney(req, res) {
    const currentMoney = await this.cashboxtransactionsService.getCurrentMoney(req);
    return res.success(currentMoney);
  }

  async handleGetRecentlyTransactions(req, res) {
    const recentlyTransactions = await this.cashboxtransactionsService.getRecentlyTransactions(req);
    return res.success(recentlyTransactions);
  }
}
