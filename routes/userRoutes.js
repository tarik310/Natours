const express = require('express');

const userController = require('../controller/userController');
const authController = require('../controller/authController');

const Router = express.Router();

Router.route('/signup').post(authController.signup);
Router.route('/signin').post(authController.signin);
Router.route('/signout').get(authController.signOut);
Router.route('/forgotpassword').post(authController.forgotPassword);
Router.route('/resetpassword/:token').patch(authController.resetPassword);

// use this middleware after this liine
Router.use(authController.protectRoutes);

Router.route('/updatepassword').patch(
  authController.protectRoutes,
  authController.updatePassword,
);
Router.route('/myprofile').get(
  authController.protectRoutes,
  userController.getMyProfile,
  userController.getOneUser,
);
Router.route('/updatemyprofile').patch(
  userController.uploadUserPicture,
  userController.resizeUserImage,
  authController.protectRoutes,
  userController.updateMyProfile,
);
Router.route('/deletemyaccount').delete(
  authController.protectRoutes,
  userController.deleteMyAccount,
);

Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userController.getAllusers)
  .post(userController.createUser);
Router.route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
