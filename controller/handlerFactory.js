const APIFeature = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('No document was found with this ID', 404));
    }

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document was found with this ID', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        newDocument,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;

    if (!document) {
      return next(new AppError('No document was found with this ID', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // allowing getting review on a tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const countQuery = new APIFeature(Model.find(), req.query).filter();
    const totalDocuments = await countQuery.query.countDocuments();

    const features = new APIFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const documents = await features.query;

    const limit = features.getLimitValue();
    const totalPagesNumber = Math.ceil(totalDocuments / limit);
    return res.status(200).json({
      status: 'success',
      metaData: {
        results: documents.length,
        totalDocuments,
        totalPagesNumber,
      },
      data: {
        documents,
      },
    });
  });
