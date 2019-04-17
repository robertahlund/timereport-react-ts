import React, {Component} from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import Routes from "./components/routes/Routes";
import {BrowserRouter} from "react-router-dom";
import firebase from './firebaseConfig';
import Modal from "./components/Modal";

const db = firebase.firestore();

export interface AuthObject {
  firstName?: string;
  lastName?: string;
  uid?: string;
}

interface AppState {
  auth: AuthObject | boolean;
}

const AuthContext = React.createContext<AuthObject | boolean>(false);

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

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
        const usersCollection = db.collection('users');
        let userData: AuthObject = {};
        await usersCollection
          .where('uid', '==', user.uid)
          .limit(1)
          .get()
          .then((querySnapshot) => querySnapshot.docs.map(doc => userData = doc.data()));
        this.setState({
          auth: userData
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
          <AuthContextProvider value={auth}>
            <Menu/>
            <Modal/>
            <Routes auth={auth}/>
          </AuthContextProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
