const awilix = require('awilix');
const fileName = require('file-name');
const camelCase = require('camel-case');

const { asValue, asFunction, asClass } = awilix;

const { SCOPED, SINGLETON } = awilix.Lifetime;

// const database = require(`${__libs}database`).default;
const Context = require(`${__libs}Context`).default;

// Create the container and set the injectionMode to PROXY (which is also the default).
const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

container.loadModules([
  `${__apis}routers/*.js`
], {
  resolverOptions: {
    // QUESTION: cac gia tri cua lifetime?
    lifetime: SCOPED,
    register: asFunction,
  },
  formatName: 'camelCase',
});

// Register validations
container.loadModules([
  `${__apis}validations/*.js`,
], {
  resolverOptions: {
    lifetime: SINGLETON,
    register: asClass,
  },
  formatName: 'camelCase',
});

// Register handlers
container.loadModules([
  `${__apis}controllers/*.js`,
], {
  resolverOptions: {
    lifetime: SCOPED,
    register: asClass,
  },
  formatName: 'camelCase',
});

// Register models
container.loadModules([
  `${__apis}models/*.js`,
], {
  resolverOptions: {
    lifetime: SCOPED,
    register: asClass,
  },
  formatName: 'camelCase',
});

// Register services
container.loadModules([
  `${__apis}services/*.js`,
], {
  resolverOptions: {
    lifetime: SCOPED,
    register: asClass,
  },
  formatName: 'camelCase',
});

// Register factories
// QUESTION: cai nay de lam gi? khong thay folder factories
container.loadModules([
  `${__apis}factories/*.js`,
], {
  resolverOptions: {
    lifetime: SCOPED,
    register: asClass,
  },
  formatName: 'camelCase',
});

// bindMethod
container.register({
  intercept: asFunction(() => (handler, method) => async (req, res, next) => {
    try {
      await handler[method](req, res, next);
    } catch (e) {
      next(e);
    }
  })
});

module.exports = (route) => [
  (req, res, next) => {
    req.container = container.createScope();
    // ANS: context cho nay la sao?
    const ctx = new Context(req);
    ctx.user = req.user;
    req.container.register({
      ctx: asValue(ctx),
    });
    next();
  },
  (req, res, next) => {
    const router = req.container.resolve(camelCase(fileName(route)));
    router(req, res, next);
  }
];
