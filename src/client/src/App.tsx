import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import Navbar from './components/common/Navbar';

import './css/helper.css';
import './App.css';
import HomeContainer from './containers/HomeContainer';

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Switch>
                <Route exact path="/" component={HomeContainer} />

                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
