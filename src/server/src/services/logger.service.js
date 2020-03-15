const log4js = require('log4js');

function getLogger(name) {
    logger = log4js.getLogger(name);
    logger.level = 'debug';
    return logger;
}

exports.getLogger = getLogger;
