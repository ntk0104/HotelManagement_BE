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
      const selectedRoom = await models.Room.findOne({
        where: { id: transaction.selectedRoomID },
      });
      const sectionTypeDescription = `${
        transaction.sectionType === 'dg' ? 'Đi giờ-' : 'QUA ĐÊM-'
      }${transaction.sectionRoomType === 'fan' ? 'Quạt' : 'Lạnh'}`;
      const systemNoteArr = JSON.parse(transaction.systemNote);
      const remainingCost = totalCost + transaction.totalSubtractedCost;
      // status của phòng ở thời điểm hiện tại ( thường là trả tiền trước nhưng sau 1 thời gian tiền > tiền trả trước thì phải đổi status )
      let updatedStatus = transaction.status;
      // nếu phòng chưa trả
      if (transaction.status === 0 || transaction.status === 1) {
        if (remainingCost > 0) {
          updatedStatus = 0;
        } else {
          updatedStatus = 1;
        }
      }
      return {
        ...transaction,
        selectedRoomName: selectedRoom.roomName,
        selectedRoomType: selectedRoom.roomType,
        sectionTypeDescription,
        timeIn: Number(transaction.timeIn),
        timeOut: Number(transaction.timeOut),
        systemNote: systemNoteArr,
        usedItems: updatedUsedItems,
        createdAt: Number(transaction.createdAt),
        updatedAt: Number(transaction.updatedAt),
        livingTime: livingTimeString,
        totalCost,
        remainingCost,
        status: updatedStatus
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
      updatedBy: req.user.email,
    };
    const pickUpMsg = `${req.user.email}: Lấy phòng lúc ${Helpers.formatDatetime()}`;
    systemNote.push(pickUpMsg);
    if (payload.isPaidAdvance) {
      const paidAdvanceMsg = `${req.user.email}: Trả trước ${Helpers.formatMoney(
        'VND',
        payload.totalPaidAdvance
      )} vào lúc ${Helpers.formatDatetime()}`;
      systemNote.push(paidAdvanceMsg);
      newTransaction.totalSubtractedCost = -payload.totalPaidAdvance;
      newTransaction.status = 1;
    }
    newTransaction.systemNote = JSON.stringify(systemNote);
    // make sure this room is not in-service - picked up by another device
    const matchingTransaction = await models.HistoryTransaction.findAll({
      where: { selectedRoomID: payload.selectedRoomID, status: { $or: [0, 1] } },
    });
    if (matchingTransaction.length > 0) {
      // this room has already picked, cannot pick this room at this time
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

  async updateTransaction(req, body) {
    const transactionId = req.params.id;
    const transactions = await models.HistoryTransaction.findOne({ where: { id: transactionId } });
    if (!transactions) {
      throw ErrorCode.ITEM_NOT_EXISTED;
    }
    await models.HistoryTransaction.update(body, { where: { id: transactionId } });
    const updatedTransaction = models.HistoryTransaction.findOne({ where: { id: transactionId } });
    return updatedTransaction;
  }
}
