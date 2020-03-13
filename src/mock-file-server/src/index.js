const app = require('express')();
const http = require('http').createServer(app);
const fs = require('fs');
const Throttle = require('throttle');

const TEMP_FILE = __dirname + '/file.tmp';

function clearTempFile() {
    fs.writeFileSync(TEMP_FILE, '');
}

function generateTempFile(size) {
    let fileSize = 0;
    let chunkSize = Math.max(Math.min(size / 2, 10000), 1);
    while (fileSize < size) {
        fs.appendFileSync(TEMP_FILE, 'a'.repeat(chunkSize));
        fileSize = fs.statSync(TEMP_FILE)['size'];
        chunkSize = Math.max(Math.min((size - fileSize) / 2, 10000), 1);
    }
}

app.get('/txt', function(req, res) {
    const fileSize = Math.round(
        req.query.size ? Number(req.query.size) : Math.random() * 100000
    );
    const throttle = new Throttle(
        req.query.throttle ? Number(req.query.throttle) : 100
    );
    res.setHeader('Content-length', fileSize);
    res.setHeader('Content-type', 'text/plain');

    clearTempFile();
    generateTempFile(fileSize);

    const outputStream = fs.createReadStream(TEMP_FILE);

    outputStream.pipe(throttle).pipe(res);
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
