var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/categories';
var db = pgp(connectionString);

// add query functions
module.exports = {
  getAllCategories: getAllCategories,
  getSingleCategory: getSingleCategory,
  getVersion: getVersion
};

function getAllCategories(req, res, next) {
  db.any('select * from category')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL categories'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleCategory(req, res, next) {
  var categoryID = parseInt(req.params.id);
  db.one('select * from category where id = $1', categoryID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE category'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getVersion(req, res, next) {
  db.any('select * from version')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved categories service version'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
