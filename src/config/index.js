/* eslint global-require: 0 */

const defaultConfig = {
  tokenSecretKey: process.env.TOKEN_SECRET_KEY || 'nHwk7nJTx4w9MUXcCplnb1ibbCgNjNvi',
  NODE_ENV: process.env.NODE_ENV,
};

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = require(`./${env}.config`);
  return Object.assign(defaultConfig, envConfig);
};

module.exports = getConfig(process.env.NODE_ENV);
