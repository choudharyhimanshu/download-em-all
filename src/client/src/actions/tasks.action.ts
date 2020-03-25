import { Dispatch } from 'redux';
import { ITask } from '../models/Task';

export enum ETaskActionType {
    CREATE = 'TASK_CREATE',
    UPDATE = 'TASK_UPDATE',
    CLEAR = 'CLEAR'
}

export interface ITaskAction {
    type: ETaskActionType;
    data?: ITask;
}

export const createTask = (dispatch: Dispatch<ITaskAction>) => {
    return async (task: ITask) => {
        dispatch({
            type: ETaskActionType.CREATE,
            data: task
        });
    };
};

export const updateTask = (dispatch: Dispatch<ITaskAction>) => {
    return async (taskProgress: ITask) => {
        dispatch({
            type: ETaskActionType.UPDATE,
            data: taskProgress
        });
    };
};

export const clearTasks = (dispatch: Dispatch<ITaskAction>) => {
    return async () => {
        dispatch({
            type: ETaskActionType.CLEAR
        });
    };
};
