const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/BadRequestError');
const BadRequestError = require('../errors/BadRequestError');

const unauthorizedError = new UnauthorizedError('Необходима авторизация');
const buildBadRequestError = new BadRequestError('Некорректные данные пользователя');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer ')) {
    next(unauthorizedError);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, '390b91924886afa7be8e8b2aa158de992b09c0d90ef540c2b81682e6544c43f6');
  } catch (err) {
    next(buildBadRequestError);
  }
  req.user = payload;
  next();
};
