const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { constants } = require('http2');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use((err, req, res, next) => {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'Неизвестная ошибка';
  res.status(status).send({ message });
  next();
});

app.listen(PORT);
