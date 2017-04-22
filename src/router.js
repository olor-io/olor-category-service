var express = require('express');
var Database = require('./database').connect();

function createRouter() {
    var router = express.Router();
    var db = Database.db;

    createRoute(router, {
        method: 'get',
        url: '/category',
        callback: function getAllCategories(req, res, next) {
            db.any('select * from category')
            .then((data) => {
                res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ' + data.length + ' categories'
                });
            })
            .catch((err) => {
                return next(err);
            });
        }
    });

    createRoute(router, {
        method: 'get',
        url: '/category/:id',
        callback: function getSingleCategory(req, res, next) {
            var categoryId = parseInt(req.params.id);
            db.one('select * from category where id = $1', categoryId)
            .then((data) => {
                res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ONE category'
                });
            })
            .catch((err) => {
                return next(err);
            });
        }
    });

    return router;
}

// TODO:
//  Implement roles to opts
function createRoute(router, opts) {
    var routeParams = [opts.url];
    routeParams.push(opts.callback);
    router[opts.method].apply(router, routeParams);
}

module.exports = createRouter;
