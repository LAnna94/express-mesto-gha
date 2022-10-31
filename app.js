const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { constants } = require('http2');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '635e4eee0475435a714fa68a',
  };

  next();
});

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
