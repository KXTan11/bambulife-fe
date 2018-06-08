import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import StarWarsView from "./StarWarsView";
import {BrowserRouter, Route } from "react-router-dom";

ReactDOM.render(
    <div>
        <BrowserRouter>
            <div>
            <Route exact path="/" component={App} />
            <Route path="/:type/:id" component={StarWarsView} />
            </div>
        </BrowserRouter>
    </div>, document.getElementById('root'));
registerServiceWorker();
