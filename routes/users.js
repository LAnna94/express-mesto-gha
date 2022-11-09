const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.get('/me', getUserById);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
