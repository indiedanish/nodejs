

const express = require("express");
var indexRouter = require('./routes/index');
var cors = require("cors"); //use this
var app = express();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors()); //and this


app.use('/', indexRouter);

var PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server running at", PORT);
});
