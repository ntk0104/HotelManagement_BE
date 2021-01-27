import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import models from '../models';
import Helpers from '../utils/helper.util';

const formatTransactionResponse = (type, response) => {
  switch (type) {
  case 'getList':
    return response.map(async (transaction) => {
      const totalRoomCost = await Helpers.calculateTransactionRoomCost(transaction);
      const totalCost = await Helpers.calculateTransactionTotalCost(transaction);
      const livingTimeString = Helpers.generateLivingDuration(
        Number(transaction.timeIn),
        Number(transaction.timeOut)
      );
      const usedItems = JSON.parse(transaction.usedItems);
      const updatedUsedItems = _.map(usedItems, (item) => (item.id === 'roomCost'
        ? {
          ...item,
          quantity: livingTimeString,
          unitPrice: totalRoomCost,
          total: totalRoomCost,
        }
        : item));
      return {
        ...transaction,
        timeIn: Number(transaction.timeIn),
        timeOut: Number(transaction.timeOut),
        systemNote: JSON.parse(transaction.systemNote),
        usedItems: updatedUsedItems,
        createdAt: Number(transaction.createdAt),
        updatedAt: Number(transaction.updatedAt),
        livingTime: livingTimeString,
        totalCost,
        remainingCost: totalCost - transaction.totalSubtractedCost,
      };
    });
  default:
    return null;
  }
};

export default class TransactionService {
  async create(req) {
    const payload = req.body;
    const systemNote = [];
    const usedItems = [];
    usedItems.push({
      id: 'roomCost',
      name: 'Tiền Phòng',
      unitPrice: '1',
      total: 0,
    });
    const newTransaction = {
      ...req.body,
      usedItems: JSON.stringify(usedItems),
      id: uuidv4(),
      createdAt: moment.now(),
      updatedAt: moment.now(),
      createdBy: req.user.email,
    };
    if (payload.isPaidAdvance) {
      const paidAdvanceMsg = `Trả trước ${Helpers.formatMoney(
        'VND',
        payload.totalPaidAdvance
      )} vào lúc ${Helpers.formatDatetime()}`;
      systemNote.push(paidAdvanceMsg);
      newTransaction.systemNote = JSON.stringify(systemNote);
      newTransaction.totalSubtractedCost = payload.totalPaidAdvance;
    }
    const matchingTransaction = await models.HistoryTransaction.findAll({
      where: { selectedRoomID: payload.selectedRoomID, status: 0 },
    });
    if (matchingTransaction.length > 0) {
      throw ErrorCode.ROOM_NOT_AVAILABLE;
    }
    const createdTransaction = await models.HistoryTransaction.create(newTransaction);
    return createdTransaction.dataValues;
  }

  async getList(req) {
    const filteredParams = req.query;
    const filteredTransactions = await models.HistoryTransaction.findAll({ where: filteredParams });
    const formatedResponse = await Promise.all(
      formatTransactionResponse('getList', filteredTransactions)
    );
    return formatedResponse;
  }
}
