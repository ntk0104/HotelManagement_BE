import Numeral from 'numeral';
import moment from 'moment';
import models from '../models/index';

const NUMERAL_K = '0[.][000]a';
const ROUND_NUMERAL_K = '0a';
const appConfig = {
  bufferTimeInMinutes: 15,
  limitHourSectionTimeInHour: 3,
  limitHourSectionToOvernightInHour: 6,
  fanHourAdditionalPrice: 20000,
  airHourAdditionalPrice: 30000,
};

const calculateNumsNightFrom = (timestampIn, timestampOut) => {
  const dateValue = moment(timestampIn).date();
  const monthValue = moment(timestampIn).month();
  const yearValue = moment(timestampIn).year();
  const timeInMoment = moment([yearValue, monthValue, dateValue]);

  const dateValueOut = moment(timestampOut).date();
  const monthValueOut = moment(timestampOut).month();
  const yearValueOut = moment(timestampOut).year();
  const timeOutMoment = moment([yearValueOut, monthValueOut, dateValueOut]);

  const numsNights = timeOutMoment.diff(timeInMoment, 'days');
  const gioVao = moment(timestampIn).hours();
  // fix bug khi user vào sau 0h và hôm qua hôm sau thì số đêm vẫn bằng 1, nhưng thực tế phải là 2 vì qua 12h hôm trước là tính 1 đêm rồi
  if (gioVao < 6) {
    return numsNights + 1;
  }
  return numsNights;
};

const calculateLivingTime = (timestampIn, timestampOut) => {
  const numberOfNights = calculateNumsNightFrom(timestampIn, timestampOut);
  let durationObj = {};
  if (numberOfNights === 0) {
    let diffTimestamp = timestampOut - timestampIn;
    const diffHours = Math.floor(moment.duration(diffTimestamp).asHours());
    if (diffHours > 0) {
      diffTimestamp -= diffHours * 60 * 60 * 1000;
    }
    const diffMinutes = Math.floor(moment.duration(diffTimestamp).asMinutes());
    durationObj = {
      nights: 0,
      hours: diffHours,
      minutes: diffMinutes,
    };
  } else {
    const checkOutDate = moment(timestampOut).format('YYYY-MM-DD');
    const generatedTimeThreshold = `${checkOutDate} 12:${appConfig.bufferTimeInMinutes}:00`;
    const generatedTimestampThreshold = moment(generatedTimeThreshold).valueOf();
    if (timestampOut > generatedTimestampThreshold) {
      const tmpTimestamp = moment(`${checkOutDate} 12:00:00`).valueOf();
      let diffTimestamp2 = timestampOut - tmpTimestamp;
      const diffHours2 = Math.floor(moment.duration(diffTimestamp2).asHours());
      if (diffHours2 > 0) {
        diffTimestamp2 -= diffHours2 * 60 * 60 * 1000;
      }
      const diffMinutes2 = Math.floor(moment.duration(diffTimestamp2).asMinutes());
      durationObj = {
        nights: numberOfNights,
        hours: diffHours2,
        minutes: diffMinutes2,
      };
    } else {
      durationObj = {
        nights: numberOfNights,
        hours: 0,
        minutes: 0,
      };
    }
  }
  return durationObj;
};

const Helpers = {
  formatMoney(ios, value) {
    if (value !== undefined) {
      const number = Number(value);
      switch (ios) {
        case 'AUD':
        case 'USD':
          return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        case 'VND':
          if (number < 1000000) {
            return Numeral(number).format(ROUND_NUMERAL_K).toUpperCase();
          }
          return Numeral(number).format(NUMERAL_K).split('.').join(',').toUpperCase();
        case 'JPY':
          return Numeral(number).format(NUMERAL_K);
        default:
          return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }
    }
    return undefined;
  },
  formatDatetime(time) {
    if (time) {
      return moment(time).format('DD/MM/YYYY HH:mm');
    }
    return moment().format('DD/MM/YYYY HH:mm');
  },
  formatHour(time) {
    if (time) {
      return moment(time).format('HH:mm');
    }
    return moment().format('HH:mm');
  },
  getRangeTimestampForDate(dateString) {
    const startingDatetsp = moment(`${dateString} 00:00:00`, 'DD/MM/YYYY hh:mm:ss').valueOf();
    const endingDatetsp = moment(`${dateString} 23:59:59`, 'DD/MM/YYYY hh:mm:ss').valueOf();
    return { start: startingDatetsp, end: endingDatetsp };
  },
  generateLivingDuration(timestampIn, tspOut) {
    const timestampOut = Number(tspOut) > 0 ? Number(tspOut) : Number(moment().valueOf());
    if (timestampIn !== 0) {
      const durationObj = calculateLivingTime(timestampIn, timestampOut);
      const { nights, hours, minutes } = durationObj;
      let durationString = '';
      if (nights > 0) {
        durationString += `${nights}đêm-`;
      }
      if (hours > 0) {
        durationString += `${hours}h-`;
      }
      durationString += `${minutes}p`;
      return durationString;
    }
    return null;
  },
  calculateRoomCostPerHour(
    timestampIn,
    timestampOut,
    overnightPrice,
    sectionHourCost,
    additionalHourPrice,
    type
  ) {
    const limitHourOfSection1 = appConfig.limitHourSectionTimeInHour; // 3 giờ đầu thì 100, quá 3 giờ thì charge thêm
    const { limitHourSectionToOvernightInHour } = appConfig; // quá 6 tiếng tính qua đem
    const bufferTime = appConfig.bufferTimeInMinutes; // sống có đức, dưới threshold thì coi như ko tính charge thêm level tiếp theo -dvt: phut

    const livingTimeObj = calculateLivingTime(timestampIn, timestampOut);
    const { nights, hours, minutes } = livingTimeObj;
    if (nights > 0) {
      return this.calculateRoomCostOvernight(
        timestampIn,
        timestampOut,
        overnightPrice,
        additionalHourPrice,
        sectionHourCost
      );
    }
    const livingTimeToSecs = hours * 3600 + minutes * 60;
    const limitSectionToSecs = limitHourOfSection1 * 3600 + bufferTime * 60;
    const limitSectionToOvernightToSecs =
      limitHourSectionToOvernightInHour * 3600 + bufferTime * 60;
    if (livingTimeToSecs > limitSectionToSecs) {
      if (livingTimeToSecs > limitSectionToOvernightToSecs) {
        return overnightPrice;
      }
      let roomCost = 0;
      if (minutes > bufferTime) {
        roomCost = (hours - limitHourOfSection1 + 1) * additionalHourPrice + sectionHourCost;
      } else {
        roomCost = (hours - limitHourOfSection1) * additionalHourPrice + sectionHourCost;
      }
      if (roomCost > overnightPrice) {
        roomCost = overnightPrice;
      }
      return roomCost;
    }
    if (type === 'additionalOverNight') {
      let additionalHour = hours;
      if (minutes > bufferTime) {
        additionalHour += 1;
      }
      return additionalHour * additionalHourPrice;
    }
    return sectionHourCost;
  },
  calculateRoomCostOvernight(
    timestampIn,
    timestampOut,
    overnightPrice,
    additionalHourPrice,
    sectionHourCost
  ) {
    const bufferTime = appConfig.bufferTimeInMinutes; // sống có đức, dưới threshold thì coi như ko tính charge thêm level tiếp theo -dvt: phut
    const numsNight = calculateNumsNightFrom(timestampIn, timestampOut);
    if (numsNight === 0) {
      const currentDate = moment(timestampOut).format('YYYY-MM-DD');
      const generatedTimeInThreshold = `${currentDate} 05:00:00`;
      const generatedTimeInstampThreshold = moment(generatedTimeInThreshold).valueOf();
      const generatedTimeOutThreshold = `${currentDate} 12:${bufferTime}:00`;
      const generatedTimestampOutThreshold = moment(generatedTimeOutThreshold).valueOf();
      if (
        timestampOut > generatedTimestampOutThreshold &&
        timestampIn < generatedTimeInstampThreshold
      ) {
        const additionalHourCost = this.calculateRoomCostPerHour(
          moment(`${currentDate} 12:00:00`).valueOf(),
          timestampOut,
          overnightPrice,
          sectionHourCost,
          additionalHourPrice,
          'additionalOverNight'
        );
        return overnightPrice + additionalHourCost;
      }
      // without charge additional hour
      return overnightPrice;
    }
    const currentDate = moment(timestampOut).format('YYYY-MM-DD');
    const generatedTimeThreshold = `${currentDate} 12:${bufferTime}:00`;
    const generatedTimestampThreshold = moment(generatedTimeThreshold).valueOf();
    if (timestampOut > generatedTimestampThreshold) {
      const additionalHourCost = this.calculateRoomCostPerHour(
        moment(`${currentDate} 12:00:00`).valueOf(),
        timestampOut,
        overnightPrice,
        sectionHourCost,
        additionalHourPrice,
        'additionalOverNight'
      );
      return numsNight * overnightPrice + additionalHourCost;
    }
    return numsNight * overnightPrice;
  },
  // dùng để tính tiền phòng only
  async calculateTransactionRoomCost(transaction) {
    const { sectionType, timeIn, selectedRoomID, status, totalCost, sectionRoomType } = transaction;
    // nếu khách đã trả phòng/ transaction đã hoàn thành
    if (status > 1) {
      return totalCost;
    }
    const additionalPrice =
      sectionRoomType === 'fan'
        ? appConfig.fanHourAdditionalPrice
        : appConfig.airHourAdditionalPrice;
    const selectedRoom = await models.Room.findOne({ where: { id: selectedRoomID } });
    const sectionPrice =
      sectionRoomType === 'fan' ? selectedRoom.shorttimePrice_Fan : selectedRoom.shorttimePrice_Air;
    // const
    if (sectionType === 'qd') {
      const roomCost = this.calculateRoomCostOvernight(
        Number(timeIn),
        moment().valueOf(),
        selectedRoom.overnightPrice,
        additionalPrice,
        sectionPrice
      );
      return roomCost;
    }
    return this.calculateRoomCostPerHour(
      Number(timeIn),
      moment().valueOf(),
      selectedRoom.overnightPrice,
      sectionPrice,
      additionalPrice
    );
  },
  // dùng để tính tổng tiền tất cả gồm tiền phòng và tiền các item khác nếu có - chưa hoàn thiện
  async calculateTransactionTotalCost(transaction) {
    const { usedItems } = transaction;
    const roomCost = await this.calculateTransactionRoomCost(transaction);
    let sumCost = 0;
    sumCost += roomCost;
    const usedItemsList = JSON.parse(usedItems);
    usedItemsList.forEach((item) => {
      if (item.id !== 'roomCost') {
        sumCost += item.total;
      }
    });
    return sumCost;
  },
};

export default Helpers;
