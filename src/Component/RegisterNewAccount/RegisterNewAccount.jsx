import React from "react";
import "./../../utility.css"
import classes from './RegisterNewAccount.module.css';
import GradientBox from './../../Element/GradientBox/GradientBox.jsx';
import ButtonPrimary from './../../Element/ButtonPrimary/ButtonPrimary.jsx';
import { useHistory, Redirect } from "react-router-dom";
import {getPrivacyMode} from "../Privacy/PrivacyMode.jsx";

export default class RegisterNewAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      matchPassword: '',
      emailVerified: false,
      userMessage1: '',
      userMessage2: '',
      userMessage3: '',
      finishSignup: false,
      token: '',
      isLoggedIn: false
    }

  }


  updateEmail = (event) => {

    this.setState({
      email: event.currentTarget.value
    });

    if (event.currentTarget.value) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(event.currentTarget.value)){
      this.setState({
        emailVerified: true,
        userMessage1: ''
      });
      } else {
        this.setState({
          emailVerified: false,
          userMessage1: 'Please enter a valid email'
        });
      }
    } else {
      this.setState({
        emailVerified: false,
        userMessage1: ''
      });
    }
  }

  updateUsername = (event) => {
    this.setState({
      username: event.currentTarget.value
    });
  }

  updatePassword = (event) => {
    this.setState({
      password: event.currentTarget.value
    });
    if (event.currentTarget.value) {
      let validpassword = event.currentTarget.value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
      if (! validpassword ) {
        this.setState({
          userMessage3: 'Password must be six characters in length and must contain: at least 1 lowercase letter, 1 captial letter, 1 number, and 1 of the following special characters: !@#$%^&*'
        });
      } else {
        this.setState({
          userMessage3: 'Password is valid'
        });
      }
    } else {
      this.setState({
        userMessage3: ''
      });
    }
  }

  matchPassword = (event) => {
    this.setState({
      matchPassword: event.currentTarget.value
    });
    if (this.state.password && event.currentTarget.value) {
      if (event.currentTarget.value != this.state.password) {
        this.setState({
          userMessage2: 'Passwords do not match'
        });
      } else {
        this.setState({
          userMessage2: 'Passwords match'
        });
      }
    } else {
      this.setState({
        userMessage2: ''
      });
    }
  }

  backToEmail = () => {
    this.setState({
      finishSignup: false
    });
  }

  continueSignup = () => {
    if (this.state.emailVerified) {
      this.setState({
        finishSignup: true
      });
    } else {
      this.setState({
        finishSignup: false
      });
    }
  }

  // add all required initializations when an account is successfully created here
  initUserPrefs = () => {
    // initialize privacy_mode user preference to public
    let privacyMode = "public";
    fetch(process.env.REACT_APP_API_PATH + "/user-preferences", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        'userID': sessionStorage.getItem("user"),
        name: "privacy_mode",
        value: privacyMode,
      })
    }).then(response => response.json())
      .then(data => {
        //console.log(data);
      });

  }

  handleSubmit = (event) => {

    event.preventDefault();

    let email = this.state.email;
    let username = this.state.username;
    let password = this.state.password;
    let matchPassword = this.state.matchPassword;
    let validpassword = this.state.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);

    if (! validpassword) {
      this.setState({
        userMessage3: 'Cannot register account, password must be six characters in length and must contain: at least 1 lowercase letter, 1 captial letter, 1 number, and 1 of the following special characters: !@#$%^&*'
      });
      return;
    }

    if (matchPassword !== password) {
      this.setState({
        userMessage2: 'Cannot register account: Passwords do not match'
      });
      return;
    }

    let url = process.env.REACT_APP_API_PATH + "/auth/signup";
    fetch(url, {
      method: "POST",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(response => response.json())
      .then(data => {
        let token = data["token"];
        this.setState({
          token: token
        });

        // set the auth token and user ID in the session state
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", data.userID);


        let user_url = process.env.REACT_APP_API_PATH + "/users/" + data.userID;
        fetch(user_url, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ data.token
          },
          body: JSON.stringify({
            email: email,
            username: username
          })
        }).then(response=> {
          if (response.status === 200) {
            return response.json();
          }
        }); //end of second fetch

        this.props.setLogin(true);
        // once registration complete - used to trigger Redirect
        this.setState({
          isLoggedIn: true
        });

        //init user prefeences once account successfully created:

        this.initUserPrefs();

      }) //end of 1st fetch then
  }

  render() {
    if (this.state.isLoggedIn) {
      return(
        <Redirect to="/home" />
      )
    }


    let continueButton;
    if (this.state.emailVerified) {
      continueButton = <ButtonPrimary disabled={false} onClick={this.continueSignup}>Continue</ButtonPrimary>//<button onClick={this.continueSignup}>Continue</button>  ;
    } else {
      continueButton = <ButtonPrimary disabled={true}>Continue</ButtonPrimary>//<button className={classes.disabled} disabled>Continue</button> ;
    }
    if (!this.state.finishSignup) {
      return(
        <div className={classes.register_account}>
          <GradientBox backPage="">
            <h1 className={classes.box__title}>Sign Up</h1>
            <label><p>Email</p>
              <input type="text" onChange={this.updateEmail} value={this.state.email} id="email"></input>
              <aside>{this.state.userMessage1}</aside>
            </label>
            {continueButton}
          </GradientBox>
        </div>
      )
    }
    else {
      return(
        <div className={classes.register_account}>
          <GradientBox backClick={this.backToEmail}>
            <h1 className={classes.box__title}>Create Account</h1>
            <form>
            <label><p>Username</p>
              <input type="text" onChange={this.updateUsername} value={this.state.username} id="username"></input>
            </label>
            <label><p>Password</p>
              <input type="password" onChange={this.updatePassword} value={this.state.password}></input>
              <aside>{this.state.userMessage3}</aside>
            </label>
            <label><p>Retype Password</p>
              <input type="password" onChange={this.matchPassword} value={this.state.matchPassword}></input>
              <aside>{this.state.userMessage2}</aside>
            </label>
            </form>
            <ButtonPrimary disabled={false} onClick={this.handleSubmit}>Sign Up</ButtonPrimary>
          </GradientBox>
        </div>
      )
    }
  }

}
