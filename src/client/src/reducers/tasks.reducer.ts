import { ITaskAction, ETaskActionType } from '../actions/tasks.action';
import { ITask } from '../models/Task';

const defaultState: ITask[] = [];

const tasksReducer = (state: ITask[] = defaultState, action: ITaskAction) => {
    switch (action.type) {
        case ETaskActionType.CREATE: {
            return [...state, action.data];
        }
        case ETaskActionType.UPDATE: {
            const taskToUpdate = state.find(task => task.id === action.data.id);
            if (taskToUpdate) {
                if (action.data.downloaded) {
                    taskToUpdate.downloaded = action.data.downloaded;
                }
                if (action.data.total) {
                    taskToUpdate.total = action.data.total;
                }
                taskToUpdate.status = action.data.status;
                taskToUpdate.message = action.data.message;
                taskToUpdate.filepath = action.data.filepath;
            }
            return [...state];
        }
        default: {
            return state;
        }
    }
};

export default tasksReducer;
