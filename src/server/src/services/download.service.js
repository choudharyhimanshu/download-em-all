const urlParser = require('url');
const EventEmitter = require('events');

const SUPPORTED_DOWNLOAD_PROTOCOLS = {
    'http:': require('http'),
    'https:': require('https')
};

function download(url, outputFileStream) {
    parsedUrl = urlParser.parse(url);
    urlProtocol = parsedUrl.protocol;

    const downloadEmitter = new EventEmitter();
    const request = SUPPORTED_DOWNLOAD_PROTOCOLS[urlProtocol].get(
        url,
        response => {
            response.on('error', error => {
                downloadEmitter.emit('error', error);
            });

            if (response.statusCode !== 200) {
                downloadEmitter.emit(
                    'error',
                    `NOK response code | CODE: ${response.statusCode}`
                );
            } else {
                let downloaded = 0;
                let downloadPercentage = 0;
                let lastDownloadPercent = 0;
                const contentLength = response.headers['content-length']
                    ? Number(response.headers['content-length'])
                    : undefined;

                downloadEmitter.emit('update', downloaded, contentLength);

                response.on('data', chunk => {
                    downloaded += chunk.length;
                    downloadPercentage = Math.trunc(
                        (downloaded / contentLength) * 100
                    );
                    if (downloadPercentage > lastDownloadPercent) {
                        lastDownloadPercent = downloadPercentage;
                        downloadEmitter.emit(
                            'update',
                            downloaded,
                            contentLength
                        );
                    }
                });

                response.on('end', () => {
                    downloadEmitter.emit('finish', downloaded);
                });

                response.pipe(outputFileStream);
            }
        }
    );
    request.on('error', error => {
        downloadEmitter.emit('error', error);
    });
    return downloadEmitter;
}

exports.SUPPORTED_DOWNLOAD_PROTOCOLS = SUPPORTED_DOWNLOAD_PROTOCOLS;
exports.download = download;
