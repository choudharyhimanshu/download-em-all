import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import HomeContainer from './containers/HomeContainer';

import './css/helper.css';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={HomeContainer} />

                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
