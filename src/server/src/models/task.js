class Task {
    id;
    url;
    downloaded;
    total;
    status;
    message;
    filepath;
    outputDir;

    constructor(
        id,
        url,
        outputDir,
        downloaded = undefined,
        total = undefined,
        status = 'PENDING',
        message = undefined,
        filepath = undefined
    ) {
        this.id = id;
        this.url = url;
        this.downloaded = downloaded;
        this.total = total;
        this.status = status;
        this.message = message;
        this.filepath = filepath;
        this.outputDir = outputDir;
    }

    toObject() {
        return {
            id: this.id,
            url: this.url,
            downloaded: this.downloaded,
            total: this.total,
            status: this.status,
            message: this.message,
            filepath: this.filepath,
            outputDir: this.outputDir
        };
    }

    toString() {
        return `{
            id: ${this.id},
            url: ${this.url},
            downloaded: ${this.downloaded},
            total: ${this.total},
            status: ${this.status},
            message: ${this.message},
            filepath: ${this.filepath},
            outputDir: ${this.outputDir}
        }`;
    }

    emitUpdate(socket) {
        socket.emit('task-update', this.toObject());
    }
}

exports.Task = Task;
