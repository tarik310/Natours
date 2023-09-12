const querystring = require('querystring');
const axios = require('axios');

const Booking = require('../Models/bookingModel');
const Tour = require('../Models/tourModel');
const Review = require('../Models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  try {
    const queryString = querystring.stringify(req.query);
    // Make an Axios GET request to the API endpoint

    const response = await axios.get(
      `http://127.0.0.1:3000/api/v1/tours?${queryString}`,
    );
    if (response.data.status === 'success') {
      const tours = response.data.data.documents; // Extract the tours from the response
      const { totalDocuments, totalPagesNumber } = response.data.metaData;
      // Render the template using the tours data
      res.status(200).render('overview', {
        title: 'All Tours',
        tours,
        totalDocuments,
        totalPagesNumber,
      });
    }
  } catch (error) {
    // Handle any errors from the Axios request
    console.error('Error fetching data:', error);
  }
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'LogIn',
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'signup',
  });
};
exports.getMyAccount = catchAsync(async (req, res, next) => {
  // 1- find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2- find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const userTours = await Tour.find({ _id: { $in: tourIds } });
  const userReviews = await Review.find({ user: req.user.id }).populate('tour');
  res.status(200).render('account', {
    title: 'My Account',
    userTours,
    userReviews,
  });
});

// exports.getMyTours = catchAsync(async (req, res, next) => {
//   // 1- find all bookings
//   const bookings = await Booking.find({ user: req.user.id });
//   // 2- find tours with the returned IDs
//   const tourIds = bookings.map((el) => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIds } });

//   res.status(200).render('overview', {
//     title: 'My Tours',
//     tours,
//   });
// });

exports.forgotMyPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('forgotpassword', {
    title: 'Forgot My Password',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'reset My Password',
  });
});
