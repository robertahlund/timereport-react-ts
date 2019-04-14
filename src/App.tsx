import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Menu } from "./components/Menu";
import { MenuItem } from "./components/MenuItem";

class App extends Component {
  componentDidMount(): void {}

  x = (event: React.MouseEvent): void => {
    console.log(event.target);
  };

  render() {
    return (
      <div className="App">
        <Menu title="Testeroni">
          <MenuItem text="Cocks" />
          <MenuItem text="Abc" />
          <MenuItem text="Qwerty" />
        </Menu>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            onClick={this.x}
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
