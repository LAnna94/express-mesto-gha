const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');
const {
  celebrateAvatar,
  celebrateProfile,
  celebrateUserId,
} = require('../validators/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', celebrateUserId, getUserById);
userRouter.patch('/me', celebrateProfile, updateUserInfo);
userRouter.patch('/me/avatar', celebrateAvatar, updateAvatar);

module.exports = userRouter;
