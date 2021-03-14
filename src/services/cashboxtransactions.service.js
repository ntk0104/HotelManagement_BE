/* eslint-disable no-case-declarations */
import moment from 'moment';
import sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import models from '../models';

export default class CashboxTransactionService {
  async create(req) {
    const payload = req.body;
    const newTransaction = {
      ...req.body,
      id: uuidv4(),
      createdAt: moment.now(),
      updatedAt: moment.now(),
      createdBy: req.user.email,
      updatedBy: req.user.email,
    };
    // nếu là chốt tiền => update baselineAmount
    if (payload.isChecked) {
      // rút tiền ra để chốt tiền
      const currentMoney = await this.getCurrentMoney();
      if (payload.type === false) {
        if (payload.changedCash > currentMoney) {
          throw ErrorCode.WITHDRAW_OVER_CASH;
        }
        newTransaction.baselineAmount = currentMoney - Number(payload.changedCash);
      } else {
        // them tien vao de chot tien
        newTransaction.baselineAmount = currentMoney + Number(payload.changedCash);
      }
      newTransaction.note = 'Chốt tiền';
    }
    const createdTransaction = await models.CashboxTransaction.create(newTransaction);
    return createdTransaction.dataValues;
  }

  async getCurrentMoney() {
    // tìm value của createdAt của lần chốt tiền gần nhất
    const lastCheck = await models.CashboxTransaction.findAll({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastCheck']],
      where: {
        isChecked: true,
      },
    });
    const lastCheckedTime = lastCheck[0].lastCheck;
    const lastCheckedTransaction = await models.CashboxTransaction.findAll({
      where: {
        createdAt: lastCheckedTime,
      },
    });
    let currentMoney = lastCheckedTransaction[0].baselineAmount;
    // các transaction sau lần chốt tiền
    const afterTransactions = await models.CashboxTransaction.findAll({
      where: {
        createdAt: { $gt: lastCheckedTime },
      },
    });
    afterTransactions.forEach((t) => {
      if (t.type) {
        currentMoney += t.changedCash;
      } else {
        currentMoney -= t.changedCash;
      }
    });
    return currentMoney;
  }

  async getRecentlyTransactions() {
    // tìm value của createdAt của lần chốt tiền gần nhất
    const lastCheck = await models.CashboxTransaction.findAll({
      attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastCheck']],
      where: {
        isChecked: true,
      },
    });
    const lastCheckedTime = lastCheck[0].lastCheck;
    const lastCheckedTransaction = await models.CashboxTransaction.findAll({
      where: {
        createdAt: lastCheckedTime,
      },
    });
    const { baselineAmount } = lastCheckedTransaction[0];
    let beforeMoney = baselineAmount;
    let afterMoney = baselineAmount;
    // các transaction sau lần chốt tiền
    const afterTransactions = await models.CashboxTransaction.findAll({
      where: {
        createdAt: { $gte: lastCheckedTime },
      },
      order: [['createdAt', 'ASC']],
    });
    const mappingResults = afterTransactions.map((t) => {
      if (t.isChecked) {
        // neu them tien de chot tien
        if (t.type) {
          return {
            ...t,
            beforeCash: t.baselineAmount - t.changedCash,
            afterCash: t.baselineAmount,
          };
        }
        // neu lay tien ra de chot tien
        return {
          ...t,
          beforeCash: t.baselineAmount + t.changedCash,
          afterCash: t.baselineAmount,
        };
      }
      // neu la them/ bot tien binh thuong
      beforeMoney = afterMoney;
      // neu la them tien
      if (t.type === true) {
        afterMoney = beforeMoney + t.changedCash;
        return {
          ...t,
          beforeCash: beforeMoney,
          afterCash: afterMoney,
        };
      }
      // neu la rut tien
      afterMoney = beforeMoney - t.changedCash;
      return {
        ...t,
        beforeCash: beforeMoney,
        afterCash: afterMoney,
      };
    });
    return mappingResults;
  }
}
