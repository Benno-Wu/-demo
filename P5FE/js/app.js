import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Hello from './components/Hello.js';

class App extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <a>test</a>
                <h2>Hello from app.js</h2>
                <Hello/>
            </div>
        );
    }
}
ReactDOM.render(<App/>, document.getElementById('app'));