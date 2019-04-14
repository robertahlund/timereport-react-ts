import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Menu } from "./components/Menu";
import { MenuItem } from "./components/MenuItem";

interface AppState {

}

class App extends Component<{}, AppState> {
  componentDidMount = (): void => {};

  x = (event: React.MouseEvent): void => {
    console.log(event.target);
  };

  render() {
    return (
      <div className="App">
        <Menu title="Testeroni">
          <MenuItem text="qwe" />
          <MenuItem text="Abc" />
          <MenuItem text="Qwerty" />
        </Menu>
      </div>
    );
  }
}

export default App;
