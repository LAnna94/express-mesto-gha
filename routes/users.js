const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  celebrateAvatar,
  celebrateProfileInfo,
  celebrateUserId,
} = require('../validators/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', celebrateUserId, getUserById);
userRouter.patch('/me', celebrateProfileInfo, updateUserInfo);
userRouter.patch('/me/avatar', celebrateAvatar, updateAvatar);

module.exports = userRouter;
