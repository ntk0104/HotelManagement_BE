const config = require(`${__config}`);
// QUESTION: passport dung de lam gi?
const passport = require('passport');
// QUESTION: passport-iwt dung de lam gi?
const passportJWT = require('passport-jwt');

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;

// QUESTION: cai nay bi duplicate code sao ko dung chung?
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromHeader('Authorization'),
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
  ]),
  secretOrKey: config.tokenSecretKey,
  passReqToCallback: true,
  expire: 1000000000, // thời gian token generate ra bị expire (giây)
  refreshExpire: 604800
};

const strategy = new JwtStrategy(jwtOptions, (req, jwtPayload, next) => {
  const token = jwtOptions.jwtFromRequest(req);
  const user = jwtPayload;
  // QUESTION: user.rf ???
  if (user && !user.rf) {
    next(null, { token, ...user });
  } else {
    next(null);
  }
});

passport.use(strategy);

module.exports = (app) => {
  // QUESTION khong hieu cho nay
  app.use(passport.initialize());
  app.use((req, res, next) => {
    const router = req.url.split('/')[2];
    if (router === 'auth') {
      return next();
    }
    return passport.authenticate(
      'jwt',
      {
        session: false,
      },
      async (err, user) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({
            error: ErrorCode.INVALID_TOKEN
          });
        }
        req.user = user;
        return next();
      }
    )(req, res, next);
  });
};
