export default class StatisticsHandler {
  constructor({ statisticsService }) {
    this.statisticsService = statisticsService;
  }

  async handleGetDateReport(req, res) {
    const filteredTransaction = await this.statisticsService.getDateReport(req);
    return res.success(filteredTransaction);
  }
}
