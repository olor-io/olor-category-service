var promise = require('bluebird');
var logger = require('./logger')(__filename);

var databaseConfig = {
    promiseLib: promise,
    error: (error, err) => {
        if (err.cn) {
            // A connection-related error
            logger.error('Cn: ', err.cn);
            logger.error('Event: ', error.message || error);
        }
    }
};

var pgp = require('pg-promise')(databaseConfig);
var db = null;

// This function can be called as many times as needed but only
// on the first the pg-promise connection will be initialized
function connect() {
    if (db === null) {
        db = pgp(process.env.DATABASE_URL);
    }

    db.connect()
    .then(obj => {
        obj.done();
    }).catch(error => {
        logger.error('Error: ', error.message || error);
    });

    return {
        db: db,
        databaseConfig: databaseConfig
    };
}

module.exports = {
    connect: connect,
    config: databaseConfig
};
