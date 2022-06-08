/*
  App.js is the starting point for the application.   All of the components in your app should have this file as the root.
  This is the level that will handle the routing of requests, and also the one that will manage communication between
  sibling components at a lower level.  It holds the basic structural components of navigation, content, and a modal dialog.
*/

import React from "react";
import "./App.css";

import "./utility.css"
import FriendList from "./Component/FriendPage/FriendList.jsx";
import LoginForm from "./Component/LoginForm.jsx";
import PasswordResetForm from "./Component/PasswordResetForm";
import Profile from "./Component/ProfileSettings/ProfileSettings.jsx";
import FriendForm from "./Component/FriendPage/FriendForm.jsx";
import Modal from "./Component/Modal.jsx";
import NavMenu from "./Component/NavMenu/NavMenu.jsx";
import MainPage from "./Component/MainPage/MainPage.jsx";
import BrowsePage from "./Component/BrowsePage/BrowsePage.jsx";
import FriendPage from "./Component/FriendPage/FriendPage.jsx";
import RegisterNewAccount from "./Component/RegisterNewAccount/RegisterNewAccount.jsx";
import AccountLogOut from "./Component/AccountLogOut/AccountLogOut.jsx";
import ContentForm from "./Component/Content/ContentForm.jsx";
import YourContentList from "./Component/Content/YourContentList.jsx";
import {
  BrowserRouter as Router, Route, Switch, Link, Redirect
} from 'react-router-dom';
import FollowersList from "./Component/Followers";
import SearchPage from "./Component/SearchPage/SearchPage.jsx";
import ProfilePage from "./Component/Profile"
import BrowsPage from "./Component/BrowsePage/BrowsePage";
import Messages from "./Component/Messages.jsx";
import Group from "./Component/Group.jsx";
import GroupMessages from "./Component/GroupMessages.jsx";
import AppMargin from "./Element/AppMargin/AppMargin.jsx";
import NotificationsPage from "./Component/NotificationsPage/NotificationsPage.jsx";

// toggleModal will both show and hide the modal dialog, depending on current state.  Note that the
// contents of the modal dialog are set separately before calling toggle - this is just responsible
// for showing and hiding the component
function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal
  });
}

// the App class defines the main rendering method and state information for the app
class App extends React.Component {

  // the only state held at the app level is whether or not the modal dialog
  // is currently displayed - it is hidden by default when the app is started.
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      refreshPosts: false,
      isLoggedIn: false,
      usernameUpdated: false,
    };

    // in the event we need a handle back to the parent from a child component,
    // we can create a reference to this and pass it down.
    this.mainContent = React.createRef();
    this.doRefreshPosts = this.doRefreshPosts.bind(this);
    this.setLogin = this.setLogin.bind(this);
  }

  // doRefreshPosts is called after the user logs in, to display relevant posts.
  // there are probably more elegant ways to solve this problem, but this is... a way
  doRefreshPosts() {
    this.setState({
      refreshPosts: true
    });
  }

  setLogin = (bool) => {
    this.setState({
      isLoggedIn: bool
    });
  }

  setUpdateUsername = (bool) => {
    this.setState({
      usernameUpdated: bool
    });
  }


  render() {
    if (sessionStorage.getItem("user") && !this.state.isLoggedIn) {
      this.setLogin(true);
    }

    return (

      // the app is wrapped in a router component, that will render the
      // appropriate content based on the URL path.  Since this is a
      // single page app, it allows some degree of direct linking via the URL
      // rather than by parameters.  Note that the "empty" route "/", which has
      // the same effect as /posts, needs to go last, because it uses regular
      // expressions, and would otherwise capture all the routes.  Ask me how I
      // know this.
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">

          <header className="App-header">
            <NavMenu userid={sessionStorage.getItem("user")} usernameUpdated={this.state.usernameUpdated} setUpdateUsername={this.setUpdateUsername} isLoggedIn={this.state.isLoggedIn} />


            <div className="maincontent" id="mainContent">
              <Switch>
                <Route path="/settings">
                  <div className="settings">
                    <Profile userid={sessionStorage.getItem("user")} setUpdateUsername={this.setUpdateUsername} />
                  </div>
                </Route>
                <Route path="/friends">
                  <AppMargin>
                    <FriendForm userid={sessionStorage.getItem("user")} />
                    <FriendList userid={sessionStorage.getItem("user")} />
                  </AppMargin>
                </Route>

                <Route path="/register-account">
                  <RegisterNewAccount setLogin={this.setLogin}></RegisterNewAccount>
                </Route>

                <Route path="/login">
                  <LoginForm refreshPosts={this.doRefreshPosts} setLogin={this.setLogin} usernameUpdated={this.state.usernameUpdated} setUpdateUsername={this.setUpdateUsername}></LoginForm>
                </Route>

                <Route path="/password-reset">
                  <PasswordResetForm isLoggedIn={this.state.isLoggedIn} setLogin={this.setLogin} />
                </Route>

                <Route path="/friend-page">
                  <FriendPage></FriendPage>
                </Route>

                <Route path="/logout">
                  <AccountLogOut isLoggedIn={this.state.isLoggedIn} setLogin={this.setLogin}></AccountLogOut>
                </Route>

                <Route path="/home">
                  <MainPage pageName="Home" isLoggedIn={this.state.isLoggedIn} userid={sessionStorage.getItem("user")}></MainPage>
                </Route>

                <Route path="/search">
                  <SearchPage isLoggedIn={this.state.isLoggedIn} userid={sessionStorage.getItem("user")}></SearchPage>
                </Route>

                <Route path="/record">
                  <h1>Record</h1>
                </Route>

                <Route path="/profile">
                  <ProfilePage />
                </Route>

                <Route path="/yourpost">
                  <YourContentList userID={sessionStorage.getItem("user")} isLoggedIn={this.state.isLoggedIn} refresh={this.props.refresh} type="postlist" />
                </Route>

                <Route path="/upload">
                  <ContentForm />
                </Route>

                <Route path="/message">
                  <Messages />
                </Route>

                <Route path="/groupmessages">
                  <GroupMessages />
                </Route>

                <Route path="/group">
                  <Group />
                </Route>

                <Route path="/notifications">
                  <NotificationsPage />
                </Route>

                <Route path="/browse">
                  <BrowsePage isLoggedIn={this.state.isLoggedIn} refresh={this.props.refresh} type="postlist" />
                </Route>

                <Route path={["/"]}>
                  <Redirect to='/home'/>
                </Route>
              </Switch>
            </div>
          </header>
          <Modal show={this.state.openModal} onClose={e => toggleModal(this, e)}>
            This is a modal dialog!
            </Modal>
        </div>
      </Router>
    );
  }
}

// export the app for use in index.js
export default App;
