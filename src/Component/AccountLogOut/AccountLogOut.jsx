import React from "react";
import classes from './AccountLogOut.module.css';
import { Link, Redirect } from "react-router-dom";

class AccountLogOut extends React.Component {

  constructor(props) {
    super(props);
  }

  postLogout = () => {
    const url = process.env.REACT_APP_API_PATH + "/auth/logout"
    fetch(url, {
    method: "POST",
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ sessionStorage.getItem("token")
    })
  }).then(response => {
      if (response.status !== 200) {
        throw response.status;
      }
    })
    .then(data => {
      this.clearStorage();
      this.props.setLogin(false);
    })
    .catch( error => {
      console.log("An error has occured:");
      console.log(error);
    });
}

  clearStorage = () => {
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("user", "");
  }

  render() {
    if (! this.props.isLoggedIn) {
        return(
          <Redirect to="/" />
        );
    } else {
        this.postLogout();
        return(
          <p>Logging out...</p>
        );
      }

  }


}

export default AccountLogOut;
