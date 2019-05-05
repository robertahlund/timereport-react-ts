import React, { Component } from "react";
import "./styles/App.css";
import "./styles/modal-transition.css";
import "./styles/react-select.css";
import Menu from "./components/menu/Menu";
import Routes from "./components/routes/Routes";
import firebase from "./firebaseConfig";
import MyAccountModal from "./components/account/MyAccountModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { User } from "firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ToastCloseIcon from "./Icons/ToastCloseIcon";
import AuthLoading from "./components/authentication/AuthLoading";

const db = firebase.firestore();

export interface AuthObject {
  firstName?: string;
  lastName?: string;
  uid?: string;
  email?: string;
  roles?: UserRoles[];
  isAdmin?: boolean;
  inactive?: boolean;
  companies?: UserCompanies[];
}

export interface UserCompanies {
  value: string;
  label: string;
}

export type UserRoles = "Administrator" | "Employee";

interface AppState {
  auth: AuthObject | boolean;
  showMyAccountModal?: boolean;
  authHasLoaded: boolean;
}

export const AuthContext = React.createContext<AuthObject | boolean>(false);

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

class App extends Component<{}, AppState> {
  state: AppState = {
    auth: false,
    showMyAccountModal: false,
    authHasLoaded: false
  };

  async componentDidMount(): Promise<void> {
    await this.authObserver();
  }

  authObserver = async (): Promise<void> => {
    try {
      firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          await this.setUserInfo(user, true);
        } else {
          console.log("Logged out");
          this.setState({
            auth: false,
            authHasLoaded: true
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  checkIfUserAccountNeedsToBeUpdated = async (user: User): Promise<void> => {
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    const updateNeeded: boolean = await usersCollection
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          userData = doc.data()!;
          const [firstName, lastName] = user.displayName!.split(" ");
          if (
            firstName !== userData.firstName ||
            lastName !== userData.lastName ||
            user.email !== userData.email!.toLowerCase()
          ) {
            console.log(
              "Data was changed, and need to be updated in the collection."
            );
            toast.info(
              "Your information was changed by an administrator and is being updated."
            );
            console.log(userData, user.email, firstName, lastName);
            return true;
          } else return false;
        } else return false;
      });
    if (updateNeeded) {
      await user.updateProfile({
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      await user.updateEmail(userData.email!);
      toast.success(
        "Your information was successfully updated. This might mean that your email has changed, and the new email should " +
          "be used to log in the next time.",
        { autoClose: false }
      );
    }
  };

  checkIfUserIsInactive = async (user: User): Promise<boolean> => {
    const usersCollection = db.collection("users");
    const inactive = await usersCollection
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data()!.inactive;
        } else return true;
      });
    return new Promise<boolean>(resolve => resolve(inactive));
  };

  setUserInfo = async (user: User, displayToast: boolean): Promise<void> => {
    console.log("Logged in");
    if (await this.checkIfUserIsInactive(user)) {
      console.log("User is inactive, logging out.");
      toast.error("This account is inactive.", { autoClose: false });
      await firebase.auth().signOut();
      return;
    }
    await this.checkIfUserAccountNeedsToBeUpdated(user);
    const usersCollection = db.collection("users");
    let userData: AuthObject = {};
    await usersCollection
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          // @ts-ignore
          userData = doc.data();
          userData.isAdmin = userData.roles
            ? userData.roles.includes("Administrator")
            : false;
        }
      });
    userData.email = user.email !== null ? user.email : "";
    this.setState({
      auth: userData,
      authHasLoaded: true
    });
    displayToast ? toast.success(`Welcome back ${userData.firstName}.`) : null;
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
    const { auth, showMyAccountModal, authHasLoaded } = this.state;
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
              <MyAccountModal
                toggleModal={this.toggleMyAccountModal}
                setUserInfo={this.setUserInfo}
                key="1"
              />
            )}
          </ReactCSSTransitionGroup>
          {authHasLoaded ? (
            <Routes />
          ) : (
              <AuthLoading/>
          )}
        </AuthContextProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          toastClassName="toast-global"
          closeButton={
            <ToastCloseIcon color="#fff" height="16px" width="16px" />
          }
        />
      </div>
    );
  }
}

export default App;
