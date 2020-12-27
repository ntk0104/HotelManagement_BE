// viewed
global.__base = `${__dirname}/`;
global.__apis = `${__dirname}/${process.env.NODE_ENV === 'development' ? 'src' : 'bin'}/`;
global.__config = `${__apis}config/`;
global.__libs = `${__apis}libs/`;
global.__models = `${__apis}models/`;
global.__services = `${__apis}services/`;
global.__controllers = `${__apis}controllers/`;
global.__routers = `${__apis}routers/`;
global.__utils = `${__apis}utils/`;
global.__public = `${__dirname}/public/`;
global.__dbmodels = `${__dirname}/db/models/`;
global.__emailTemplate = `${__dirname}/data/email-template/`;
global.Constants = require(`${__dirname}/data/Constants`);
global.ErrorCode = require(`${__dirname}/data/ErrorCode`);