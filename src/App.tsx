import React, {Component} from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import Routes from "./components/routes/Routes";
import {BrowserRouter} from "react-router-dom";
import firebase from './firebaseConfig';

const db = firebase.firestore();

interface AppState {
  auth: boolean
}

class App extends Component<{}, AppState> {
  state: AppState = {
    auth: false
  };

  async componentDidMount(): Promise<void> {
    await this.authObserver();
  }

  authObserver = async (): Promise<void> => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('Logged in');
        this.setState({
          auth: true
        })
      } else {
        console.log('Logged out');
        this.setState({
          auth: false
        })
      }
    })
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
