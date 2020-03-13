const fs = require('fs');
const slugify = require('slugify');
const urlParser = require('url');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const DOWNLOAD_DIR = 'downloads';

const supportedProtocols = {
    'http:': require('http'),
    'https:': require('https')
};

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

function urlToFilename(url) {
    const foo = url
        .split('?')[0]
        .split('/')
        .slice(-1)
        .pop();
    return slugify(foo);
}

function download(url, socket) {
    const filename = urlToFilename(url);
    const file = fs.createWriteStream(DOWNLOAD_DIR + '/' + filename);
    const request = supportedProtocols[
        urlParser.parse(url).protocol || 'http:'
    ].get(url, function(response) {
        const contentLength = response.headers['content-length']
            ? Number(response.headers['content-length'])
            : 0;

        response.pipe(file);

        let done = 0;
        let donePercentage = 0;
        let lastDonePercent = 0;
        socket.emit('task-progress', {
            downloaded: done,
            total: contentLength,
            status: 'DOWNLOADING',
            message: ''
        });

        response.on('data', chunk => {
            done += chunk.length;
            donePercentage = Math.trunc((done / contentLength) * 100);
            if (donePercentage > lastDonePercent) {
                lastDonePercent = donePercentage;
                socket.emit('task-progress', {
                    downloaded: done,
                    total: contentLength,
                    status: 'DOWNLOADING',
                    message: ''
                });
            }
        });

        response.on('end', () => {
            socket.emit('task-progress', {
                downloaded: done,
                total: contentLength,
                status: 'DONE',
                message: file.path
            });
            file.close();
        });
    });
}

app.get('/', function(req, res) {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket) {
    console.log('a client connected');

    socket.on('task-request', function(url) {
        console.log('Received: ' + url);
        download(url, socket);
    });

    socket.on('disconnect', function() {
        console.log('client disconnected');
    });
});

http.listen(4000, function() {
    console.log('listening on *:4000');
});
