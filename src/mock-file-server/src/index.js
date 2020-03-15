const app = require('express')();
const http = require('http').createServer(app);
const fs = require('fs');
const Throttle = require('throttle');

const TEMP_DIR = __dirname + '/temp/';
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
} else {
    fs.rmdirSync(TEMP_DIR, { recursive: true });
    fs.mkdirSync(TEMP_DIR);
}

function createTempFile() {
    return (
        TEMP_DIR +
        `file-${Math.random()
            .toString(36)
            .substring(4)}.tmp`
    );
}

function deleteTempFile(file) {
    fs.unlinkSync(file);
    console.log('deleted file: ', file);
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
    res.setHeader('Content-length', fileSize);
    res.setHeader('Content-type', 'text/plain');

    const file = createTempFile();
    generateTempFile(file, fileSize);

    fs.createReadStream(file)
        .pipe(throttle)
        .pipe(res);

    res.on('finish', () => {
        console.log('finished ', file);
        deleteTempFile(file);
    });
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
