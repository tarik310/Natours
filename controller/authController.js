const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_JWT_EXPIRES_IN * 60 * 60 * 100,
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);

  // removing password from the response
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/myAccount`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1- check if user provide email and password
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  // 2- check if user exist and if the password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.signOut = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 60 * 100),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
});
exports.protectRoutes = catchAsync(async (req, res, next) => {
  // 1- check if there is a token and get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('you are not logged in, please log in to get access', 401),
    );
  }
  // 2- verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3- check if user of the token still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('the user of this token does not exist. log in again', 401),
    );
  }

  // 4- check if password changed after generating token
  if (freshUser.isPasswordChanged(decoded.iat)) {
    return next(new AppError('password is recently changed. login again', 401));
  }

  // grant access to protected route
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 2- verification token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );

    // 3- check if user of the token still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next();
    }

    // 4- check if password changed after generating token
    if (freshUser.isPasswordChanged(decoded.iat)) {
      return next();
    }

    // grant access to protected route
    res.locals.user = freshUser;
    return next();
  }
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1- get user email and check if exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('there is no user with this email', 404));
  }
  // 2- generate reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3- send the email

  // const message = `forgot your password you idiot? here is the link to reset it again: ${resetURL} \n
  // you have 10 mintues to reset the password, otherwise ....
  // do not forget the new one also you idiot`;
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/resetpassword/${resetToken}`;
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Some Idiot Forgot his/her Password',
    //   message,
    // });
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'reset link sent to your Email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        `there was a problem sending email. try again later: ${err}`,
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1- get token based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2- if the token hasn't expired and the user is found, set new password
  if (!user) {
    return next(new AppError('token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3- update passwordChangedAt field in the user
  // 4- log in the user
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1- get user
  const user = await User.findById(req.user.id).select('+password');
  // 2- check if the posted password is same with the current password
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is wrong', 401));
  }
  // 3- update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4- log in again and send token
  createSendToken(user, 200, res);
});
