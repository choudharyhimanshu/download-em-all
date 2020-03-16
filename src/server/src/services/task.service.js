const fs = require('fs');

const logger = require('../services/logger.service').getLogger('task-service');
const downloadService = require('../services/download.service');
const utilService = require('./util.service');

const CONCURRENT_TASKS = 3;
let runningTasks = 0;
const tasksQueue = [];

function addTask(taskRequest) {
    logger.info(`[${taskRequest.task.id}] Adding task to queue`);
    tasksQueue.push(taskRequest);
    logger.info(`[${taskRequest.task.id}] Task added to queue`);
    if (runningTasks < CONCURRENT_TASKS) {
        executeTask();
    }
}

function executeTask() {
    logger.info(
        `Running tasks: ${runningTasks} | Queue size: ${tasksQueue.length}`
    );
    if (tasksQueue.length > 0) {
        const nextTaskRequest = tasksQueue.shift();
        runningTasks++;
        logger.info(`[${nextTaskRequest.task.id}] Executing task`);
        processTask(nextTaskRequest.socket, nextTaskRequest.task, () => {
            logger.info(`[${nextTaskRequest.task.id}] Task executed`);
            runningTasks--;
            executeTask();
        });
    }
}

function processTask(socket, task, callback) {
    if (!fs.existsSync(task.outputDir)) {
        logger.warn(
            `[${task.id}] Creating output directory: ${task.outputDir}`
        );
        try {
            fs.mkdirSync(task.outputDir);
        } catch (error) {
            logger.warn(
                `[${task.id}] Error creating output dirctory: ${task.outputDir}`
            );
            socket.emit('task-update', {
                id: task.id,
                status: 'ERROR',
                message: `${error.toString()}`
            });
            callback();
            return;
        }
    }

    const filename = utilService.filenameFromUrl(task.url, task.outputDir);
    logger.info(`[${task.id}] Filename from URL: ${filename}`);

    const fileWriteStream = fs.createWriteStream(
        task.outputDir + '/' + filename
    );
    task.filepath = task.outputDir + '/' + filename;
    logger.info(`[${task.id}] Output filepath: ${task.filepath}`);

    logger.info(`[${task.id}] Starting download..`);
    const downloadProgress = downloadService.download(
        task.url,
        fileWriteStream
    );

    downloadProgress.on('error', error => {
        logger.error(`[${task.id}] Error in download: ${error.toString()}`);
        socket.emit('task-update', {
            id: task.id,
            status: 'ERROR',
            message: error.toString()
        });
        fileWriteStream.destroy();
        logger.error(`[${task.id}] Destroyed file write stream`);
        fs.unlinkSync(task.filepath);
        logger.error(`[${task.id}] Deleted error file: ${task.filepath}`);
        callback();
    });

    downloadProgress.on('finish', downloaded => {
        logger.info(`[${task.id}] Finished downloading.`);
        socket.emit('task-update', {
            id: task.id,
            downloaded,
            status: 'SUCCESS',
            filepath: task.filepath
        });
        fileWriteStream.close();
        logger.info(`[${task.id}] Closed file write stream`);
        callback();
    });

    downloadProgress.on('update', (downloaded, total) => {
        logger.info(
            `[${task.id}] Updating download progress: ${downloaded}/${total}`
        );
        socket.emit('task-update', {
            id: task.id,
            downloaded,
            total,
            status: 'PROCESSING'
        });
    });
}

exports.addTask = addTask;
