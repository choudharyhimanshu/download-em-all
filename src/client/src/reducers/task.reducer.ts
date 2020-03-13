import { ITaskAction, ETaskActionType } from '../actions/task.action';
import { ITaskProgress } from '../models/TaskProgress';

const defaultState: ITaskProgress = {
    downloaded: 0,
    total: 0,
    status: 'PENDING',
    message: ''
};

const taskReducer = (
    state: ITaskProgress = defaultState,
    action: ITaskAction
) => {
    switch (action.type) {
        case ETaskActionType.UPDATE: {
            return { ...action.data };
        }
        default: {
            return state;
        }
    }
};

export default taskReducer;
