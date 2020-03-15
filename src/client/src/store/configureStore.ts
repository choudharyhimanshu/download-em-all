import {
    createStore,
    applyMiddleware,
    combineReducers,
    Middleware
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { ITask } from '../models/Task';
import tasksReducer from '../reducers/tasks.reducer';

export interface IRootReducerState {
    tasks: ITask[];
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
        tasks: tasksReducer
    }),
    applyMiddleware(...middlewares)
);

export default store;
