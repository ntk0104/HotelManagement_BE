import Helpers from '../utils/helper.util';
import models from '../models/index';
import _ from 'lodash';

export default class TransactionService {
  async getDateReport(req) {
    const dateString = req.query.date;
    const selectedDateTsp = Helpers.getRangeTimestampForDate(dateString);
    let allUsedItems = [];
    // lấy các transactions có selectedDate 23:59:59 > giờ ra > selectedDate 00:00:00
    const checkOutInDateTransactions = await models.HistoryTransaction.findAll({
      where: {
        timeOut: {
          $lte: selectedDateTsp.end,
          $gte: selectedDateTsp.start,
        },
      },
      // attributes: [
      //   'id',
      //   'timeIn',
      //   'timeOut',
      //   'selectedRoomID',
      //   'usedItems',
      //   'sectionType',
      //   'sectionRoomType',
      //   'status',
      //   'totalCost',
      //   'updatedBy',
      // ],
    });
    // tổng totalCost của các section
    const totalRevenue = checkOutInDateTransactions.reduce(
      (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.totalCost,
      0
    );
    // tổng cost các lượt đi giờ
    const totalHourTransactionsRevenue = checkOutInDateTransactions
      .filter((t) => t.sectionType === 'dg' && t.status !== 3)
      .reduce(
        (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.totalCost,
        0
      );
    // tổng cost các lượt đi giờ quạt
    const totalHourFanTransactionsRevenue = checkOutInDateTransactions
      .filter((t) => t.sectionType === 'dg' && t.sectionRoomType === 'fan' && t.status !== 3)
      .reduce(
        (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.totalCost,
        0
      );
    // tổng cost các lượt đi giờ lạnh
    const totalHourAirTransactionsRevenue = checkOutInDateTransactions
      .filter((t) => t.sectionType === 'dg' && t.sectionRoomType === 'air' && t.status !== 3)
      .reduce(
        (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.totalCost,
        0
      );
    // tổng cost các lượt qua đêm
    const totalOvernightTransactionsRevenue = checkOutInDateTransactions
      .filter((t) => t.sectionType === 'qd' && t.status !== 3)
      .reduce(
        (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.totalCost,
        0
      );
    // tổng cost các lượt khách trốn
    const totalLostRevenue = checkOutInDateTransactions
      .filter((t) => t.status === 3)
      .reduce(
        (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.totalCost,
        0
      );
    // tính chi phí của từng usedItem
    checkOutInDateTransactions
      .filter((t) => t.status !== 3)
      .forEach((t) => {
        const usedItemsOfTransaction = JSON.parse(t.usedItems);
        allUsedItems = [...allUsedItems, ...usedItemsOfTransaction];
      });
    const groupedUsedItems = _.groupBy(allUsedItems, 'id');
    const listItems = Object.keys(groupedUsedItems);
    const itemsRevenue = listItems.map((itemKey) => {
      const itemTotal = allUsedItems
        .filter((item) => item.id === itemKey)
        .reduce(
          (accumulator, currentValue, currentIndex, array) => accumulator + currentValue.total,
          0
        );
      const itemName = allUsedItems.find((i) => i.id === itemKey);
      return {
        id: itemKey,
        itemName: itemName.name,
        total: itemTotal,
      };
    });
    // group transaction theo phòng và sort theo thời gian
    const groupedTransactionByRoomId = _.groupBy(checkOutInDateTransactions, 'selectedRoomID');
    const listUsedRooms = Object.keys(groupedTransactionByRoomId).sort();
    const sortedByTimeInTransactions = {};
    listUsedRooms.map((roomId) => {
      // danh sách các transaction đã xài phòng này
      const listTransactionsUsedThisRoom = checkOutInDateTransactions
        .filter((t) => t.selectedRoomID === roomId)
        .sort((t1, t2) => t2.timeIn - t1.timeIn);
      sortedByTimeInTransactions[roomId] = listTransactionsUsedThisRoom;
    });
    return {
      totalRevenue,
      totalFromHour: totalHourTransactionsRevenue,
      totalFromHour_Fan: totalHourFanTransactionsRevenue,
      totalFromHour_Air: totalHourAirTransactionsRevenue,
      totalFromOvernight: totalOvernightTransactionsRevenue,
      totalLost: totalLostRevenue,
      transactions: sortedByTimeInTransactions,
      itemsRevenue,
    };
  }
}
