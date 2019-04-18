import React, { Component } from "react";
import "./App.css";
import Menu from "./components/menu/Menu";
import Routes from "./components/routes/Routes";
import { BrowserRouter } from "react-router-dom";
import firebase from "./firebaseConfig";
import MyAccountModal from "./components/account/MyAccountModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const db = firebase.firestore();

export interface AuthObject {
  firstName?: string;
  lastName?: string;
  uid?: string;
}

interface AppState {
  auth: AuthObject | boolean;
  showMyAccountModal?: boolean;
}

const AuthContext = React.createContext<AuthObject | boolean>(false);

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

class App extends Component<{}, AppState> {
  state: AppState = {
    auth: false,
    showMyAccountModal: true
  };

  async componentDidMount(): Promise<void> {
    await this.authObserver();
  }

  authObserver = async (): Promise<void> => {
    try {
      firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          console.log("Logged in");
          const usersCollection = db.collection("users");
          let userData: AuthObject = {};
          await usersCollection
            .where("uid", "==", user.uid)
            .limit(1)
            .get()
            .then(querySnapshot =>
              querySnapshot.docs.map(doc => (userData = doc.data()))
            );
          this.setState({
            auth: userData
          });
        } else {
          console.log("Logged out");
          this.setState({
            auth: false
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  toggleMyAccountModal = (event: React.MouseEvent): void => {
    const { target, currentTarget } = event;
    if (target === currentTarget) {
      this.setState(prevState => ({
        showMyAccountModal: !prevState.showMyAccountModal
      }));
    }
  };

  render() {
    const { auth, showMyAccountModal } = this.state;
    return (
      <div className="App">
        <AuthContextProvider value={auth}>
          <Menu toggleModal={this.toggleMyAccountModal} />
          <ReactCSSTransitionGroup
            transitionName="modal-transition"
            transitionEnterTimeout={0}
            transitionLeaveTimeout={0}
          >
            {showMyAccountModal && (
              <MyAccountModal toggleModal={this.toggleMyAccountModal} key="1" />
            )}
          </ReactCSSTransitionGroup>
          <Routes auth={auth} />
        </AuthContextProvider>
      </div>
    );
  }
}

export default App;
