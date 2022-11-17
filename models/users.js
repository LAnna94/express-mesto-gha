const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/BadRequestError');

const regex = /^https?:\/\/(www\.)?[a-zA-Z\0-9]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

const unauthorizedError = new UnauthorizedError('Неправильная почта или пароль');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => regex.test(value),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((document) => {
      if (!document) {
        throw unauthorizedError;
      }
      return bcrypt.compare(password, document.password)
        .then((matched) => {
          if (!matched) {
            throw unauthorizedError;
          }

          const user = document.toObject();
          delete user.password;
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
