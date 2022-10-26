import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT);
mongoose.connect('mongodb://localhost:27017/mestodb');
