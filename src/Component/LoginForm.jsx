import React from "react";

import "../App.css";
import classes from "./RegisterNewAccount/RegisterNewAccount.module.css";
import GradientBox from "../Element/GradientBox/GradientBox";
import ButtonPrimary from "../Element/ButtonPrimary/ButtonPrimary";
import {Link, Redirect} from "react-router-dom";


// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      alanmessage: "",
      sessiontoken: "",
      validEmailMessage: "",
      validPasswordMessage: "",
      emailVerified: false,
      passwordVerified: false,
      isLoggedIn: this.props.isLoggedIn !== undefined ? this.props.isLoggedIn : false,
      needsRefresh: false,
      key: ""
    };
    this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
    this.setUpdateUsername = this.setUpdateUsername.bind(this);
  }

  // once a user has successfully logged in, we want to refresh the post
  // listing that is displayed.  To do that, we'll call the callback passed in
  // from the parent.
  refreshPostsFromLogin(){
    this.props.refreshPosts();
  }

  setUpdateUsername(){
    this.props.setUpdateUsername();
  }

  // when the user hits submit, process the login through the API
  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

    this.loginHandler()

  };

  loginHandler = () => {

    if (this.state.emailVerified === false || this.state.emailVerified === false) {
      console.log(this.state.emailVerified)
      if (this.state.passwordVerified === false) this.setState({validPasswordMessage: "Please enter a valid password."})
      if (this.state.emailVerified === false) this.setState({validEmailMessage: "Please enter a valid email."})
    }
    else {
      //make the api call to the authentication page
      //make the api call to the authentication page
      fetch(process.env.REACT_APP_API_PATH+"/auth/login", {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
          .then(res => res.json())
          .then(
              result => {
                console.log("Testing");
                if (result.userID) {

                  // set the auth token and user ID in the session state
                  sessionStorage.setItem("token", result.token);
                  sessionStorage.setItem("user", result.userID);

                  this.setState({
                    sessiontoken: result.token,
                    alanmessage: result.token,
                    isLoggedIn: true
                  });

                  this.props.setLogin(true);

                  // call refresh on the posting list
                  this.refreshPostsFromLogin();

                  this.props.setUpdateUsername(true);

                } else {

                  // if the login failed, remove any infomation from the session state
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("user");
                  this.setState({
                    sessiontoken: "",
                    alanmessage: result.message
                  });
                }
              },
              error => {
                alert("Log-in info not recognized!");
              }
          );
    }
  }

  updateEmailHandler = (event) => {

    this.setState({email: event.currentTarget.value});

    if (event.currentTarget.value) {
      (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(event.currentTarget.value)) ? this.setState({emailVerified: true, validEmailMessage: ''}) : this.setState({emailVerified: false, validEmailMessage: 'Please enter a valid email'})
    } else {
      this.setState({ emailVerified: false, validEmailMessage: ''});
    }
  }

  updatePasswordHandler = event => {
    this.setState({password: event.target.value});
    if (event.currentTarget.value){
      ((/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).test(event.currentTarget.value)) ?
          this.setState({passwordVerified: true, validPasswordMessage: ''}) :
          this.setState({passwordVerified: false, validPasswordMessage: 'Password must be six characters in length and must contain: at least 1 lowercase letter, 1 captial letter, 1 number, and 1 of the following special characters: !@#$%^&*'});
    }
  };



  render() {
    // console.log("Rendering login, token is " + sessionStorage.getItem("token"));

    if (document.getElementById("login") != null){
      if(this.state.emailVerified && this.state.passwordVerified){
        document.getElementById("login").style.opacity = "100%"
      }
      else{
        document.getElementById("login").style.opacity = "60%"
      }
    }

    if(this.state.isLoggedIn){
      return (
          <Redirect to="/home"/>
      )
    }

    else if (!sessionStorage.getItem("token")) {
      if(!this.state.isLoggedIn){
        return(
            <div>
              <GradientBox backPage="">
                <h1 className={classes.box__title}>Log In</h1>
                <label><p>Email</p>
                  <input type="text" onChange={this.updateEmailHandler} value={this.state.email} id="email"/>
                  <aside>{this.state.validEmailMessage}</aside>
                </label>
                <Link style={{color: "#2A6180", cursor:"pointer", float:"right", textDecoration:"none", fontFamily: "Roboto, sans-serif"}} to="/register-account" className="btn btn-primary">Create Account</Link>
                <label><p>Password</p>
                  <input type="password" onChange={this.updatePasswordHandler} value={this.state.password} id="password"/>
                  <aside>{this.state.validPasswordMessage}</aside>
                </label>
                <Link style={{color: "#2A6180", cursor:"pointer", float:"right", textDecoration:"none", fontFamily: "Roboto, sans-serif"}} to="/password-reset" className="btn btn-primary">Forgot Password?</Link>
                <ButtonPrimary onClick={this.submitHandler} id={"login"}>Log In</ButtonPrimary>
              </GradientBox>
            </div>
        )
      }
    }
  }
}