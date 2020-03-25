import { ITaskAction, ETaskActionType } from '../actions/tasks.action';
import { ITask } from '../models/Task';

const defaultState: ITask[] = [];

const tasksReducer = (state: ITask[] = defaultState, action: ITaskAction) => {
    switch (action.type) {
        case ETaskActionType.CREATE: {
            if (action.data) {
                return [...state, action.data];
            }
            return [...state];
        }
        case ETaskActionType.UPDATE: {
            const data = action.data;
            if (data) {
                const taskToUpdate = state.find(task => task.id === data.id);
                if (taskToUpdate) {
                    if (data.downloaded) {
                        taskToUpdate.downloaded = data.downloaded;
                    }
                    if (data.total) {
                        taskToUpdate.total = data.total;
                    }
                    taskToUpdate.status = data.status;
                    taskToUpdate.message = data.message;
                    taskToUpdate.filepath = data.filepath;
                }
            }
            return [...state];
        }
        case ETaskActionType.CLEAR: {
            return [...defaultState];
        }
        default: {
            return state;
        }
    }
};

export default tasksReducer;
