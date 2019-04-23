import React, { Component } from "react";
import "./App.css";
import Menu from "./components/menu/Menu";
import Routes from "./components/routes/Routes";
import firebase from "./firebaseConfig";
import MyAccountModal from "./components/account/MyAccountModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { User } from "firebase";

const db = firebase.firestore();

export interface AuthObject {
  firstName?: string;
  lastName?: string;
  uid?: string;
  email?: string;
  roles?: UserRoles[]
}

export type UserRoles = 'Administrator' | 'Employee';

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
    showMyAccountModal: false,
  };

  async componentDidMount(): Promise<void> {
    await this.authObserver();
  }

  authObserver = async (): Promise<void> => {
    try {
      firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          await this.setUserInfo(user);
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

  setUserInfo = async (user: User): Promise<void> => {
    console.log("Logged in");
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    await usersCollection
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          // @ts-ignore
          userData = doc.data();
        }
      });
    userData.email = user.email !== null ? user.email : "";
    this.setState({
      auth: userData
    });
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
              <AuthContextConsumer>
                {authContext => (
                  <MyAccountModal
                    toggleModal={this.toggleMyAccountModal}
                    context={authContext}
                    setUserInfo={this.setUserInfo}
                    key="1"
                  />
                )}
              </AuthContextConsumer>
            )}
          </ReactCSSTransitionGroup>
          <Routes auth={auth} />
        </AuthContextProvider>
      </div>
    );
  }
}

export default App;
