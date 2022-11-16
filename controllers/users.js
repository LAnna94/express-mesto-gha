const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
// const HTTPError = require('../errors/HTTPError');

const buildServerError = new ServerError('На сервере произошла ошибка');
const notFoundError = new NotFoundError('Пользователь не найден');
const buildBadRequestError = new BadRequestError('Некорректные данные пользователя');
const notUniqueUserError = new ConflictError('Пользователь с указанным email уже существует');
const unauthorizedError = new UnauthorizedError('Неправильная почта или пароль');

// получение всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(buildServerError));
};

// получение пользователя по Id
/* module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
}; */

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(buildBadRequestError);
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return User.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...user } = document.toObject();
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(notUniqueUserError);
      } else if (err.name === 'ValidationError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};

// обновление информации о пользователе
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw buildBadRequestError;
      }
    })
    .catch((err) => {
      if (err.name === 'castError' || err.name === 'ValidationError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};

// обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw buildBadRequestError;
      }
    })
    .catch((err) => {
      if (err.name === 'castError' || err.name === 'ValidationError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAgt: 3600000 * 24,
        httpOnly: true,
      }).send({ token });
    })
    .catch(() => {
      next(unauthorizedError);
    });
};
