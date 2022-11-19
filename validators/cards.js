const { celebrate, Joi } = require('celebrate');
const regexUrl = require('./common');

module.exports.celebrateBodyCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(regexUrl).uri({ scheme: ['http', 'https'] }).required(),
  }),
});

module.exports.celebrateCardId = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }).required(),
});
