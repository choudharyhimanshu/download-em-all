const app = require('express')();
const http = require('http').createServer(app);
const fs = require('fs');
const Throttle = require('throttle');

const logger = require('log4js').getLogger('index');
logger.level = 'debug';

const TEMP_DIR = __dirname + '/temp/';
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
} else {
    fs.rmdirSync(TEMP_DIR, { recursive: true });
    fs.mkdirSync(TEMP_DIR);
}

function createTempFilename() {
    return (
        TEMP_DIR +
        `file-${Math.random()
            .toString(36)
            .substring(4)}.tmp`
    );
}

function deleteTempFile(file) {
    fs.unlinkSync(file);
    logger.info(`Deleted file: ${file}`);
}

function generateTempFile(file, size) {
    let fileSize = 0;
    let chunkSize = Math.max(Math.min(size / 2, 10000), 1);
    while (fileSize < size) {
        fs.appendFileSync(file, 'a'.repeat(chunkSize));
        fileSize = fs.statSync(file)['size'];
        chunkSize = Math.max(Math.min((size - fileSize) / 2, 10000), 1);
    }
}

app.get('/test.txt', function(req, res) {
    const fileSize = Math.round(
        req.query.size ? Number(req.query.size) : Math.random() * 100000
    );
    const throttle = new Throttle(
        req.query.throttle ? Number(req.query.throttle) : 100
    );
    logger.info(`File size: ${fileSize} | Throttle: ${throttle.bps}`);

    res.setHeader('Content-length', fileSize);
    res.setHeader('Content-type', 'text/plain');

    const file = createTempFilename();
    logger.info(`Temp filename: ${file}`);
    generateTempFile(file, fileSize);
    logger.info(`Put content to temp file: ${file}`);

    fs.createReadStream(file)
        .pipe(throttle)
        .pipe(res);
    logger.info(`Temp file piped to response: ${file}`);

    res.on('close', () => {
        logger.info(`Response closed: ${file}`);
        deleteTempFile(file);
    });
});

http.listen(6052, function() {
    logger.info('Listening on *:6052');
});
