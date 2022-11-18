const { celebrate, Joi } = require('celebrate');

module.exports.celebrateBodyCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/^https?:\/\/(www\.)?[a-zA-Z\0-9]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/).uri({ scheme: ['http', 'https'] }).required(),
  }),
});

module.exports.celebrateCardId = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }).required(),
});
