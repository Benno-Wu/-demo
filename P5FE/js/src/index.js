import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Login, MySpace, Home, Search } from "./Views/Views";
import { Router, Route } from "react-router";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Route exact path='/' component={Login} />
                <Route path='/home/' component={Home} />
                <Route path='/space/' component={MySpace} />
                <Route path='/search/' component={Search} />
            </Router>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('app'));