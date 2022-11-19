const { celebrate, Joi } = require('celebrate');
const regexUrl = require('./common');

module.exports.celebrateBodyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexUrl).uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.celebrateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.celebrateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regexUrl).uri({ scheme: ['http', 'https'] }),
  }),
});

module.exports.celebrateProfileInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.celebrateUserId = celebrate({
  params: Joi.object({
    userId: Joi.alternatives().try(
      Joi.string().equal('me'),
      Joi.string().hex().length(24).required(),
    ).required(),
  }).required(),
});
