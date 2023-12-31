const multer = require('multer');
const sharp = require('sharp');

const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image, try uploading again', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPicture = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 85 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
exports.getMyProfile = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  // 1- create error if user try to update password here
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('you can not update password on this route', 400));
  }
  // 2- update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'this route is not defined yet',
  });
};

exports.getAllusers = handlerFactory.getAll(User);
exports.getOneUser = handlerFactory.getOne(User);
// don't update password with this
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
