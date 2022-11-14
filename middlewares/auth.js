const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/BadRequestError');
const BadRequestError = require('../errors/BadRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

const unauthorizedError = new UnauthorizedError('Необходима авторизация');
const buildBadRequestError = new BadRequestError('Некорректные данные пользователя');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(unauthorizedError);
  }

  const token = authorization.replace(/^Bearer\s/i, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(buildBadRequestError);
  }
  req.user = payload;
  next();
};
