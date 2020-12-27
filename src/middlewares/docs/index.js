import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
//QUESTION: bien __config define o dau nhi? ko thay import
const config = require(`${__config}`);
//QUESTION: bien __base define o dau nhi? ko thay import
const pathDocs = `${__base}docs-swagger/`;
const pathSchema = `${pathDocs}schema`;
const pathSource = `${pathDocs}source`;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Hotel Management API Docs",
    version: "1.0.0"
  },
  host: config.baseUrl,
  basePath: '/',
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [
    `${pathSchema}/**/*.yaml`,
    `${pathSource}/**/*.yaml`
  ]
});

module.exports = function (app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
