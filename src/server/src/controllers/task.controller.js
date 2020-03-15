const urlParser = require('url');

const logger = require('../services/logger.service').getLogger(
    'task-controller'
);
const taskService = require('../services/task.service');

const SUPPORTED_DOWNLOAD_PROTOCOLS = require('../services/download.service')
    .SUPPORTED_DOWNLOAD_PROTOCOLS;

const DEFAULT_DOWNLOAD_DIR = __dirname + '/downloads';

function createTask(socket, taskRequest) {
    logger.info(
        `Received: ${taskRequest.id}-${taskRequest.url}-${taskRequest.outputDir} on ${socket.id}`
    );

    if (!socket) {
        logger.error(`Invalid socket value: `, socket);
        return;
    }

    if (!taskRequest.id) {
        logger.warn(`[${socket.id}] Invalid request ID: ${taskRequest.id}`);
        socket.emit('task-reject', {
            ...taskRequest,
            message: 'Invalid request ID.'
        });
        return;
    }

    if (!taskRequest.url) {
        logger.warn(
            `[${taskRequest.id}] Invalid request URL: ${taskRequest.url}`
        );
        socket.emit('task-reject', {
            ...taskRequest,
            message: 'Invalid request URL.'
        });
        return;
    } else {
        urlProtocol = urlParser.parse(taskRequest.url).protocol;
        if (!(urlProtocol in SUPPORTED_DOWNLOAD_PROTOCOLS)) {
            logger.warn(
                `[${taskRequest.id}] Unsupported URL protocol: ${taskRequest.url}`
            );
            socket.emit('task-reject', {
                ...taskRequest,
                message: 'Unsupported URL protocol.'
            });
            return;
        }
    }

    if (!taskRequest.outputDir) {
        logger.info(
            `[${taskRequest.id}] Using DEFAULT output directory: ${DEFAULT_DOWNLOAD_DIR}`
        );
        taskRequest.outputDir = DEFAULT_DOWNLOAD_DIR;
    }

    logger.info(`[${taskRequest.id}] Adding task`);
    taskService.addTask({
        socket,
        task: {
            id: taskRequest.id,
            url: taskRequest.url,
            outputDir: taskRequest.outputDir
        }
    });
    logger.info(`[${taskRequest.id}] Task added`);
}

exports.createTask = createTask;
