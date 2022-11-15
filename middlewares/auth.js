const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/BadRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

const unauthorizedError = new UnauthorizedError('Необходима авторизация');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw unauthorizedError;
  }

  const token = authorization.replace(/^Bearer\s/i, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(unauthorizedError);
  }
  req.user = payload;
  next();
};

module.exports = auth;
