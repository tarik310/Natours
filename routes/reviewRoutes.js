const express = require('express');

const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

const Router = express.Router({ mergeParams: true });

Router.use(authController.protectRoutes);

Router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'),
  // reviewController.setTourIds,
  reviewController.createReview,
);
Router.route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );
module.exports = Router;
