import React, {Component} from "react";
import "./styles/App.css";
import "./styles/modal-transition.css";
import "./styles/react-select.css";
import Menu from "./components/menu/Menu";
import Routes from "./components/routes/Routes";
import firebase from "./config/firebaseConfig";
import MyAccountModal from "./components/account/MyAccountModal";
import {User} from "firebase";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ToastCloseIcon from "./icons/ToastCloseIcon";
import AuthLoading from "./components/authentication/AuthLoading";
import {AuthContextProvider} from "./context/authentication/authenticationContext";
import {checkIfUserInformationHasChanged, checkIfUserIsInactive, getEmployeeById} from "./api/employeeApi";
import {AuthObject} from "./types/types";
import ReactDOM from "react-dom";
import {modalPortal} from "./constants/generalConstants";
import {Modal} from "react-native";
import ModalPortal from "./components/general/ModalPortal";

interface AppState {
  auth: AuthObject | boolean;
  showMyAccountModal?: boolean;
  authHasLoaded: boolean;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    auth: false,
    showMyAccountModal: false,
    authHasLoaded: false
  };

  componentDidMount(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.authObserver();
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
    const updateNeeded: boolean | string = await checkIfUserInformationHasChanged(user);
    if (updateNeeded && typeof updateNeeded === "boolean") {
      console.log("Data was changed, and need to be updated in the collection.");
      toast.success(
        "An administrator has updated your information. This might mean that the email you log in with has changed. Verify under 'My account' that it has not changed.",
        {autoClose: false}
      );
    }
  };

  setUserInfo = async (user: User, displayToast: boolean): Promise<void> => {
    console.log("Logged in");
    if (await checkIfUserIsInactive(user)) {
      toast.error("This account is inactive.", {autoClose: false});
      await firebase.auth().signOut();
      return;
    }
    await this.checkIfUserAccountNeedsToBeUpdated(user);
    let userData: AuthObject | string = await getEmployeeById(user.uid);
    if (typeof userData !== "string") {
      userData.email = user.email !== null ? user.email : "";
      this.setState({
        auth: userData,
        authHasLoaded: true
      });
      displayToast ? toast.success(`Welcome back ${userData.firstName}.`) : null;
    }
  };

  toggleMyAccountModal = (event: React.MouseEvent): void => {
    const {target, currentTarget} = event;
    if (target === currentTarget) {
      this.setState(prevState => ({
        showMyAccountModal: !prevState.showMyAccountModal
      }));
    }
  };

  render() {
    const {auth, showMyAccountModal, authHasLoaded} = this.state;
    return (
      <div className="App">
        <AuthContextProvider value={auth}>
          <Menu toggleModal={this.toggleMyAccountModal}/>
          {showMyAccountModal && (
            <ModalPortal>
              <MyAccountModal
                toggleModal={this.toggleMyAccountModal}
                setUserInfo={this.setUserInfo}
                key="1"
              />
            </ModalPortal>
          )}
          {authHasLoaded ? (
            <Routes/>
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
            <ToastCloseIcon color="#fff" height="16px" width="16px"/>
          }
        />
      </div>
    );
  }
}

export default App;
