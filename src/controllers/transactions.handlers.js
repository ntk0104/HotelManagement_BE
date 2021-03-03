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

  async getTimeLine(req, res) {
    const timeline = await this.transactionsService.getTimeline(req);
    return res.success(timeline);
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

  async handleCheckoutTransaction(req, res) {
    const updatedBody = {
      ...req.body,
      updatedAt: moment.now(),
      // checkout thì người tính tiền không phải là người cuối cùng update - mục đích là để chủ kiểm soát nhanh coi nhân viên có lén bớt tiền phòng xuống để ăn chênh lệch hay ko
      // updatedBy: req.user.email
    };
    const updatedTransaction = await this.transactionsService.updateTransaction(req, updatedBody);
    return res.success(updatedTransaction);
  }
}
