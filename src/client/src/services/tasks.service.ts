import openSocket from 'socket.io-client';
import { createTask, updateTask } from '../actions/tasks.action';
import store from '../store/configureStore';
import { ETaskStatus, ITask } from '../models/Task';

export const socket: SocketIOClient.Socket = openSocket(
    'http://localhost:6051'
);

socket.on('task-update', (task: ITask) => {
    updateTask(store.dispatch)(task);
});

socket.on('task-reject', (task: ITask) => {
    updateTask(store.dispatch)({ ...task, status: ETaskStatus.ERROR });
});

export function submitTasks(urls: string[], outputDir: string) {
    const filteredUrls = urls.filter(url => !!url);
    filteredUrls.forEach(url => {
        const task = {
            id: Math.random()
                .toString(36)
                .substring(4),
            url: url,
            downloaded: 0,
            total: 0,
            status: ETaskStatus.PENDING
        };

        createTask(store.dispatch)(task).then(() => {
            socket.emit('task-request', {
                id: task.id,
                url: task.url,
                outputDir: outputDir
            });
        });
    });
}
