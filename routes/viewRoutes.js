const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

const Router = express.Router();

// Router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest hiker',
//     user: 'tarik',
//   });
// });
Router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
Router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
Router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

Router.get('/forgot-my-password', viewController.forgotMyPassword);
Router.get('/resetpassword/:token', viewController.resetPassword);
Router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

Router.get(
  '/myAccount',
  authController.protectRoutes,
  viewController.getMyAccount,
);
// Router.get(
//   '/my-tours',
//   authController.protectRoutes,
//   viewController.getMyTours,
// );
module.exports = Router;
