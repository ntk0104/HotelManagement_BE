/* eslint new-cap: [0], radix: [0]  */
import _ from 'lodash';
// ASK13: hàm này dùng để làm gì?
const _parseDataToTemplate = (data, template) => {
  const filter = new JSON.filter(template);
  return filter.apply(data);
};

const _responseJson = (res, data) => {
  let result;
  if (res.template) {
    result = _parseDataToTemplate(data, res.template);
  } else {
    result = data;
  }
  return res.json({
    message: 'SUCCESS',
    data: result,
  });
};

const _paginationJson = (res, data, filter) => {
  const totalPage = parseInt(data.total / filter.pageSize);
  const totalPageMod = data.total % filter.pageSize;
  return res.send({
    data: {
      ...data,
      page: filter.page + 1,
      pageSize: filter.pageSize,
      totalPage: totalPage + (totalPageMod ? 1 : 0),
    }
  });
};

const _initFilter = (queryParams) => {
  const {
    page, pageSize
  } = queryParams;
  // QUESTION: lodash_omit la gi?
  const filter = _.omit(queryParams, ['q', 'page', 'pageSize', 'sort']);

  const filterRaw = [];
  // QUESTION: khong hieu cho nay
  Object.keys(filter).forEach((key) => {
    if (filter[key] === '') {
      delete filter[key];
    }

    if (typeof filter[key] === 'object' && !Array.isArray(filter[key])) {
      Object.keys(filter[key]).forEach((subKey) => {
        if (filter[key][subKey] === '') {
          delete filter[key][subKey];
        } else {
          filterRaw.push(`"${key}"->>'${subKey}' = '${filter[key][subKey]}'`);
        }
      });
      delete filter[key];
    }
  });

  let { q, sort: order } = queryParams;

  if (q) {
    q = _convertToUnsignedKeywords(q);
  }

  if (order) {
    order = [{
      column: order[0] === '-' ? order.substr(1) : order,
      order: order[0] === '-' ? 'desc' : 'asc',
    }];
  }

  return {
    q,
    order: order || [],
    filter: filter || {},
    page: (+page || 1) - 1,
    pageSize: +pageSize || 10,
    filterRaw: filterRaw ? filterRaw.join(' AND ') : undefined,
  };
};

const _preBodyHandle = (bodyParams) => {
  if (bodyParams.phoneNumber) {
    bodyParams.phoneNumber = _removeZeroAndPlusPrefix(bodyParams.phoneNumber);
  }
  return bodyParams;
};

module.exports = (req, res, next) => {
  req.body = _preBodyHandle(req.body);
  req.filter = _initFilter(req.query);

  res.success = (data) => {
    _responseJson(res, data);
  };

  res.pagination = (data) => {
    _paginationJson(res, data, req.filter);
  };
  next();
};
