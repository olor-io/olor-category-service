var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();

var db = require('./router');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/category', db.getAllCategories);
app.get('/api/category/:id', db.getSingleCategory);
app.get('/api/version', db.getVersion);

module.exports = router;
module.exports = app;
