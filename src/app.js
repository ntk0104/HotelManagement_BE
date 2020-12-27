require('../global');

const express = require('express');
const fs = require('fs');
// QUESTION: cookieParser de lam gi
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middleware Config
app.use(cors());
app.use(morgan('common')); // use predefined config
app.use(express.json({ limit: '50mb' }));
// QUESTION: nay de lam gi
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
require('./middlewares/docs')(app);

app.get('/', (req, res) => res.send('DEMO API'));

require('./middlewares/authentication')(app);
// tai sao khong dat response la middleware cuoi cung - để mấy thằng dưới dùng đc res.success..
app.use(require('./middlewares/response'));
const containerMiddleware = require('./middlewares/container');

fs.readdirSync(__routers).forEach((route) => {
  if (!route || route[0] === '.') {
    return false;
  }
  return app.use(`/v1/${route.split('.')[0]}`, containerMiddleware(route));
});

require('./middlewares/error-handlers')(app);

module.exports = app;
