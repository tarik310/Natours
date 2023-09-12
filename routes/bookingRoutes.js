const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');

const Router = express.Router({ mergeParams: true });

Router.use(authController.protectRoutes);

Router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

Router.use(authController.restrictTo('admin', 'lead-guide'));
Router.route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
Router.route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = Router;
