const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { celebrateBodyCard, celebrateCardId } = require('../validators/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrateBodyCard, createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', celebrateCardId, likeCard);
cardsRouter.delete('/:cardId/likes', celebrateCardId, dislikeCard);

module.exports = cardsRouter;
