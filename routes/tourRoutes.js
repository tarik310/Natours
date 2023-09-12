const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoutes');

const Router = express.Router();

// Router.param('id', tourController.checkId);
Router.use('/:tourId/reviews', reviewRouter);

Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAllTours,
);
Router.route('/tour-stats').get(tourController.getTourStats);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(
  tourController.getToursWithin,
);
Router.route('/tours-distances/:latlng/unit/:unit').get(
  tourController.getToursDistance,
);

Router.route('/monthly-plan/:year').get(
  authController.protectRoutes,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan,
);

Router.route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
Router.route('/:id')
  .get(tourController.getOneTour)
  .patch(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourPictures,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protectRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );
module.exports = Router;
