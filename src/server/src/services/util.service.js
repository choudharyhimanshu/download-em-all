const fs = require('fs');
const slugify = require('slugify');
const urlParser = require('url');
const pathParser = require('path');

function filenameFromUrl(url, dir) {
    const parsedUrl = urlParser.parse(url);
    const parsedFilename = pathParser.parse(parsedUrl.pathname);

    const filename = parsedFilename.name;
    const ext = parsedFilename.ext;

    let suffix = 1;
    let newFilename = filename;
    while (fs.existsSync(dir + pathParser.sep + newFilename + ext)) {
        newFilename = filename + `-${suffix++}`;
    }
    return newFilename + ext;
}

exports.filenameFromUrl = filenameFromUrl;
