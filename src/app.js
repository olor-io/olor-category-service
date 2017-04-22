require('./setup-env-vars');

var express = require('express');
var path = require('path');
var http = require('http');
var errorhandler = require('errorhandler');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var gracefulExit = require('express-graceful-exit');
var logger = require('./logger')(__filename);
var Database = require('./database');
var createRouter = require('./router');

var API_PREFIX = '/api/' + process.env.API_VERSION;

function startApp() {
    if (!process.env.DATABASE_URL) {
        logger.error('Environment variables not set!');
        throw new Error('Missing environment variables');
    }

    var db = Database.connect();
    var app = express();
    app.use(express.static(path.join(__dirname, 'public')));

    app.enable('trust proxy');

    // Disable X-Powered-By header to prevent automatic scanners detecting the framework
    app.disable('x-powered-by');

    if (process.env.NODE_ENV === 'production' &&
        process.env.LOG_REQUESTS === 'true') {
        // Log requests on production only if env variable is set
        app.use(morgan('combined'));
    }

    if (process.env.NODE_ENV === 'test') {
        if (process.env.VERBOSE_TESTS === 'true') {
            app.use(morgan('  <- :method :url :status :response-time ms - :res[content-length]'));
        }
    }

    if (process.env.NODE_ENV === 'development') {
        // Pretty print JSON responses in development
        app.set('json spaces', 2);
        app.use(morgan('dev'));
    }

    if (process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test') {
        // Disable caching for easier testing
        app.use(function noCache(req, res, next) {
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', 0);
            next();
        });
    }

    app.use(cookieParser());
    app.use(bodyParser.json());

    // https://github.com/mathrawka/express-graceful-exit
    app.use(gracefulExit.middleware(app));

    // Initialize routes
    var router = createRouter();
    app.use(API_PREFIX, router);

    app.use(function convertValidationErrorToBadRequest(err, req, res, next) {
        if (err && err.name === 'ValidationError') {
            err.status = 400;
        }

        next(err, req, res, next);
    });

    if (process.env.NODE_ENV === 'test') {
        app.use(function(err, req, res, next) {
            // Log all internal server errors anyway
            if (err && (err.status === 500 || !err.status)) {
                logger.info(err.stack);
            } else if (process.env.VERBOSE_TESTS === 'true') {
                logger.info(err.stack);
            }

            next(err);
        });
    }

    if (process.env.NODE_ENV !== 'test') {
        app.use(function errorLogger(err, req, res, next) {
            var status = err.status ? err.status : 500;
            var logMethod = status === 500 ? logger.error : logger.warn;

            // Skip unnecessary stack traces for Not Found requests
            if (status >= 400 && status !== 404) {
                // XXX: Should we remove secrets from logs?
                logMethod('Request headers:');
                logMethod(req.headers);
                logMethod('Request parameters:');
                logMethod(req.params);
                logMethod('Request body:');
                logMethod(req.body);
            }

            if (status === 500 || process.env.LOG_STACK_TRACES === 'true') {
                // Print stack traces only of internal server errors
                logMethod(err.stack);
            } else {
                logMethod(err.toString());
            }

            next(err);
        });
    }

    if (process.env.NODE_ENV === 'production') {
        // XXX: All errors thrown must not contain sensitive data in .message
        app.use(function errorResponder(err, req, res, next) {
            var message;
            var status = err.status ? err.status : 500;

            var httpMessage = http.STATUS_CODES[status];
            if (status < 500) {
                message = httpMessage + ': ' + err.message;
            } else {
                message = httpMessage;
            }

            res.status(status);
            res.send({ error: message });
        });
    } else {
        // This is not production safe error handler
        app.use(errorhandler());
    }

    // Start server
    var server = app.listen(process.env.PORT, function() {
        logger.info(
            'Express server listening on port %d in %s mode',
            process.env.PORT,
            app.get('env')
        );
    });

    function doExit() {
        gracefulExit.gracefulExitHandler(app, server, {
            log: true,
            logger: logger.info
        });
    }

    // Handle SIGTERM gracefully
    process.once('SIGTERM', function() {
        logger.info('SIGTERM received');
        logger.info('Closing http.Server ..');
        doExit();
    });

    // Handle Ctrl-C gracefully
    process.once('SIGINT', function() {
        logger.info('SIGINT(Ctrl-C) received');
        logger.info('Closing http.Server ..');
        doExit();
    });

    return {
        app: app,
        server: server,
        db: db
    };
}

module.exports = startApp;
