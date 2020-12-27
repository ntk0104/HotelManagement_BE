/* eslint global-require: 0 */
// question require('@babel/register'); la gi?
const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv || nodeEnv === 'development') {
  require('@babel/register');
}
// question require('babel-polyfill'); la gi?
if (!global._babelPolyfill) {
  require('babel-polyfill');
}

const app = require('./src/app');

app.listen(8200, () => {
  console.log('Listen....');
});
