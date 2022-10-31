const { constants } = require('http2');
const Card = require('../models/cards');

// получение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

// создание новой карточки
module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные карточки' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные карточки' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// лайк карточки
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные карточки' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// удаление лайка
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные карточки' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
