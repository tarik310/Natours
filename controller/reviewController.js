const Review = require('../Models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

// exports.setTourIds = (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.createReview = catchAsync(async (req, res, next) => {
  const newDocument = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: req.user.id,
    tour: req.params.tourId,
  });
  return res.status(201).json({
    status: 'success',
    data: {
      newDocument,
    },
  });
});

exports.getReview = handlerFactory.getOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
