import {
    createStore,
    applyMiddleware,
    combineReducers,
    Middleware
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { ITaskProgress } from '../models/TaskProgress';
import taskReducer from '../reducers/task.reducer';

export interface IRootReducerState {
    task: ITaskProgress;
}

const middlewares: Middleware[] = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middlewares.push(
        createLogger({
            collapsed: true
        })
    );
}

const store = createStore(
    combineReducers<IRootReducerState>({
        task: taskReducer
    }),
    applyMiddleware(...middlewares)
);

export default store;
