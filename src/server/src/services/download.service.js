const urlParser = require('url');
const EventEmitter = require('events');

const SUPPORTED_DOWNLOAD_PROTOCOLS = {
    'http:': require('http'),
    'https:': require('https'),
    'ftp:': require('ftp')
};

function download(url, outputFileStream) {
    parsedUrl = urlParser.parse(url);
    urlProtocol = parsedUrl.protocol;

    switch (urlProtocol) {
        case 'https:': {
            return downloadHttp(url, outputFileStream, urlProtocol);
        }
        case 'ftp:': {
            return downloadFtp(url, outputFileStream, urlProtocol);
        }
        default: {
            return downloadHttp(url, outputFileStream, urlProtocol);
        }
    }
}

function downloadHttp(url, outputFileStream, protocol = 'http:') {
    const downloadEmitter = new EventEmitter();
    const request = SUPPORTED_DOWNLOAD_PROTOCOLS[protocol].get(
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
                const contentLength = response.headers['content-length']
                    ? Number(response.headers['content-length'])
                    : undefined;

                downloadEmitter.emit('update', 0, contentLength);

                copyResponseToFile(
                    response,
                    outputFileStream,
                    contentLength,
                    downloadEmitter
                );
            }
        }
    );
    request.on('error', error => {
        downloadEmitter.emit('error', error);
    });
    return downloadEmitter;
}

function downloadFtp(url, outputFileStream, protocol = 'ftp:') {
    const downloadEmitter = new EventEmitter();

    const client = new SUPPORTED_DOWNLOAD_PROTOCOLS[protocol]();

    try {
        const parsedURL = urlParser.parse(url);
        client.connect({
            host: parsedURL.host
        });

        client.on('error', error => {
            downloadEmitter.emit('error', error);
        });

        client.on('ready', () => {
            client.size(parsedURL.pathname, (error, contentLength) => {
                if (error) {
                    downloadEmitter.emit('error', error);
                } else {
                    downloadEmitter.emit('update', 0, contentLength);
                    client.get(parsedURL.pathname, (error, response) => {
                        if (error) {
                            downloadEmitter.emit('error', error);
                        } else {
                            copyResponseToFile(
                                response,
                                outputFileStream,
                                contentLength,
                                downloadEmitter,
                                () => client.end()
                            );
                        }
                    });
                }
            });
        });
    } catch (error) {
        downloadEmitter.emit('error', error);
    }

    return downloadEmitter;
}

function copyResponseToFile(
    response,
    outputFileStream,
    contentLength,
    downloadEmitter,
    callback = undefined
) {
    let downloaded = 0;
    let downloadPercentage = 0;
    let lastDownloadPercent = 0;

    response.on('data', chunk => {
        downloaded += chunk.length;
        downloadPercentage = Math.trunc((downloaded / contentLength) * 100);
        if (downloadPercentage > lastDownloadPercent) {
            lastDownloadPercent = downloadPercentage;
            downloadEmitter.emit('update', downloaded, contentLength);
        }
    });

    response.on('end', () => {
        downloadEmitter.emit('finish', downloaded);
        if (callback) {
            callback();
        }
    });

    response.pipe(outputFileStream);
}

exports.SUPPORTED_DOWNLOAD_PROTOCOLS = SUPPORTED_DOWNLOAD_PROTOCOLS;
exports.download = download;
