const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const logger = require('./services/logger.service').getLogger('index');

const taskController = require('./controllers/task.controller');

app.get('/', function(req, res) {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket) {
    logger.info('Client connected: ', socket.id);

    socket.on('task-request', request =>
        taskController.createTask(socket, request)
    );

    socket.on('disconnect', function() {
        logger.info('Client disconnected: ', socket.id);
    });
});

http.listen(4000, function() {
    logger.info('Listening on *:4000');
});
