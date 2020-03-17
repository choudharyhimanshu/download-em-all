import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import HomeContainer from './containers/HomeContainer';
import TaskServerHealthCheck from './components/TaskServerHealthCheck';

import './css/helper.css';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <TaskServerHealthCheck />

            <Switch>
                <Route exact path="/" component={HomeContainer} />

                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
