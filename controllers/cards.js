const Card = require('../models/cards');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const ForbiddenError = require('../errors/ForbiddenError');

const buildServerError = new ServerError('На сервере произошла ошибка');
const notFoundError = new NotFoundError('Пользователь не найден');
const buildBadRequestError = new BadRequestError('Некорректные данные пользователя');
const forbiddenError = new ForbiddenError('Это действие возможно только со своими карточками');

// получение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(buildServerError));
};

// создание новой карточки
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};

// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw notFoundError;
      } else if (card.owner.toString() !== req.user._id) {
        throw forbiddenError;
      } else {
        res.send(card);
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

// лайк карточки
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};

// удаление лайка
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(buildBadRequestError);
      } else {
        next(buildServerError);
      }
    });
};
