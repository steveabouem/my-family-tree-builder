// copy of assets/js/app.js
import React from "react";
import ReactDom from "react-dom";
import './styles/index.scss';

class App extends React.Component {
    render() {
        console.log('HOJLA')
        return (
            <div>
                APP
            </div>
        )
    }
}

ReactDom.render(<App />, document.getElementById('root'))