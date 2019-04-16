import React, {Component} from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import Routes from "./components/routes/Routes";
import {BrowserRouter} from "react-router-dom";

interface AppState {
    auth: boolean
}

class App extends Component<{}, AppState> {
    state: AppState = {
        auth: false
    };

    render() {
        const {auth} = this.state;
        return (
            <BrowserRouter>
                <div className="App">
                    <Menu auth={auth}/>
                    <Routes auth={auth}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
