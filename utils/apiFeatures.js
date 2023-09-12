/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.limitValue = undefined; // Default limit value if not provided
  }

  filter() {
    // 1) filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort = price or -price or price, ratingsAverage
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.field) {
      const fields = this.queryString.field.split(',').join(' ');
      this.query = this.query.select(fields);
      // field = price or -price or price,ratingsAverage,name
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    // const limit = this.queryString.limit * 1 || 12;
    this.limitValue = this.queryString.limit * 1 || 12;
    const skip = (page - 1) * this.limitValue;
    this.query = this.query.skip(skip).limit(this.limitValue);
    return this;
  }

  getLimitValue() {
    return this.limitValue;
  }
}

module.exports = APIFeature;
