import { Dispatch } from 'redux';
import { ITaskProgress } from '../models/TaskProgress';

export enum ETaskActionType {
    UPDATE = 'TASK_UPDATE'
}

export interface ITaskAction {
    type: ETaskActionType;
    data: ITaskProgress;
}

export const updateTaskProgress = (dispatch: Dispatch<ITaskAction>) => {
    return async (taskProgress: ITaskProgress) => {
        dispatch({
            type: ETaskActionType.UPDATE,
            data: taskProgress
        });
    };
};
