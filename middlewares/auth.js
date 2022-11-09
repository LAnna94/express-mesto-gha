const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '390b91924886afa7be8e8b2aa158de992b09c0d90ef540c2b81682e6544c43f6');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
