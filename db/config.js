const config = require(`${__config}`);

const getPGUrl = (cf) => `postgres://${cf.username}:${cf.password}@${cf.host}:${cf.port}/${cf.database}`;

module.exports = {
  client: 'pg',
  connection: getPGUrl(config.database),
};
