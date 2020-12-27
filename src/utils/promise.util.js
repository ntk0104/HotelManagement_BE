// QUESTION: tai sao phai tao cai wrapper nay
export default function promiseWrapper(context, func, ...args) {
  if (typeof func !== 'function') {
    return Promise.reject('INVALID_FUNCTION');
  }

  return new Promise((resolve, reject) => {
    func.call(context, ...args, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
