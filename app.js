const express       = require('express');
const path          = require('path');
const logger        = require('morgan');
const swaggerJSDoc  = require('swagger-jsdoc');

const apiRouter     = require('./routes/apiRouter');
const docsRouter    = require('./routes/docsRouter');

const conf          = require('./config');

require('./authenticate'); //needed for authentication do not uncomment

let mongoose = require('mongoose');
mongoose.connect(conf.db.url);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('successfully connected to mongoose');
});

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//cross origin accept
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

app.use('/api', apiRouter);
app.use('/', docsRouter);

// swagger definition
const swaggerDefinition = conf.swagger.definition;
// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./controllers/v1/*.js']
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  err.text = 'Not Found';
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  
  const text = err.text || err.message || err;
  
  res.status(status).json({
    status: status,
    success: false,
    message: text
  });
});

module.exports = app;
