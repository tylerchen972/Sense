import React from "react";

import "../App.css";
import classes from "./RegisterNewAccount/RegisterNewAccount.module.css";
import GradientBox from "../Element/GradientBox/GradientBox";
import { Redirect } from "react-router-dom";


// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class PasswordResetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            newPassword: "",
            matchNewPassword: "",
            alanmessage: "",
            sessiontoken: "",
            validEmailMessage: "",
            validPasswordMessage: "",
            passwordMatchMessage: "",
            resetPasswordToken: "",
            emailVerified: false,
            passwordVerified: false,
            emailSent: false,
            passwordReset: false,
            key: ""
        };
    }

    updateEmailHandler = (event) => {
        this.setState({email: event.currentTarget.value});

        if (event.currentTarget.value) {
            (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(event.currentTarget.value)) ? this.setState({emailVerified: true, validEmailMessage: ''}) : this.setState({emailVerified: false, validEmailMessage: 'Please enter a valid email'})
        } else {
            this.setState({ emailVerified: false, validEmailMessage: ''});
        }
    }

    updateResetTokenHandler = (event) => {
        this.setState({resetPasswordToken: event.currentTarget.value})
    }

    updateNewPasswordHandler = (event) => {
        this.setState({newPassword: event.currentTarget.value});
        if (event.currentTarget.value){
            ((/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).test(event.currentTarget.value)) ?
                this.setState({passwordVerified: true, validPasswordMessage: ''}) :
                this.setState({passwordVerified: false, validPasswordMessage: 'Password must contain: at least 1 lowercase letter, 1 captial letter, 1 number, and 1 of the following special characters: !@#$%^&*'});
        }
    }

    updateMatchNewPasswordHandler = (event) => {
        this.setState({matchNewPassword: event.currentTarget.value});
        if (event.currentTarget.value) {
            this.state.matchNewPassword === this.state.newPassword ? this.setState({passwordMatchMessage: "Passwords do not match"}) : this.setState({passwordMatchMessage: ""})
        }
    }

    sendEmailHandler = event => {
        //keep the form from actually submitting
        event.preventDefault();
        this.setState({resettingPassword: true});

        if(!this.state.emailVerified){
            this.setState({validEmailMessage: "Please enter a valid email."})
        } else {
            fetch(process.env.REACT_APP_API_PATH + "/auth/request-reset", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email
                })
            })
            this.setState({emailSent: true})
        }
    };

    resetPasswordSubmitHandler = (event) => {
        event.preventDefault();

        let token = this.state.resetPasswordToken;
        let password = this.state.newPassword;
        let matchPassword = this.state.matchNewPassword;

        if(!this.state.passwordVerified || token === "" || matchPassword !== password) {
            if (!((/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).test(event.currentTarget.value))) {
                this.setState({validPasswordMessage: 'Password must be six characters in length and must contain: at least 1 lowercase letter, 1 captial letter, 1 number, and 1 of the following special characters: !@#$%^&*'});
            }
            if (matchPassword !== password) {
                this.setState({passwordMatchMessage: 'Cannot change password: Passwords do not match'})
            }
            if (password === "") {
                this.setState({validPasswordMessage: 'Cannot change password: Please enter a new password'})
            }
            if (token === "") {
                this.setState({tokenMessage: "Please enter the token from email"})
            }
        } else {
            let url = process.env.REACT_APP_API_PATH + "/auth/reset-password";
            fetch(url, {
                method: "POST",
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    token: token,
                    password: password
                })
            })
                .then(res => res.json())
                .then(
                    error => {
                        alert("Incorrect confirmation code!");
                    }
                );
            this.setState({passwordReset: true})
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            this.props.setLogin(false);
        }
    }

    render() {

        if(this.state.passwordReset){
            return (
                <Redirect to='/login'/>
            )
        }

        if (this.state.emailVerified && document.getElementById("continue")!= null){
            if (document.getElementById("continue")!= null) document.getElementById("continue").style.opacity = "100%"
        } else if(document.getElementById("continue")!= null) {
            if (document.getElementById("continue")!= null) document.getElementById("continue").style.opacity = "60%"
        }

        if (!this.state.emailSent){
            return(
                <form onSubmit={this.sendEmailHandler} id="sendEmail">
                    <GradientBox backPage="">
                        <h1 className={classes.box__title}>Reset Password</h1>
                        <label><p>Enter email registered with account:</p>
                            <input type="text" onChange={this.updateEmailHandler} value={this.state.email} id="email"/>
                            <aside>{this.state.validEmailMessage}</aside>
                        </label>
                        <div style={{verticalAlign: "Bottom"}}>
                            <button style={{opacity: "60%", float: "Right", border: "none", borderRadius: "5px", background: "#6994A2", padding: "8px", fontFamily: "Roboto, sans-serif", fontSize: "22px", fontWeight: "bold", color: "white", cursor: "pointer"}}
                                    type="submit"
                                    value="submit"
                                    id="continue">
                                Continue
                            </button>
                        </div>
                    </GradientBox>
                </form>
            )
        }

        else{
            return(
                <form onSubmit={this.resetPasswordSubmitHandler} id="resetPasswordForm">
                    <GradientBox backPage="">
                        <h1 className={classes.box__title}>Reset Password</h1>
                        <label><p>Confirmation Code</p>
                            <input type="text" onChange={this.updateResetTokenHandler} value={this.state.resetPasswordToken} placeholder = "Enter Token from Email."/>
                            <aside>{this.state.tokenMessage}</aside>
                        </label>
                        <label><p>New Password</p>
                            <input type="password" onChange={this.updateNewPasswordHandler} value={this.state.newPassword}/>
                            <aside>{this.state.validPasswordMessage}</aside>
                        </label>
                        <label><p>Repeat New Password</p>
                            <input type="password" onChange={this.updateMatchNewPasswordHandler} value={this.state.matchNewPassword}/>
                            <aside>{this.state.passwordMatchMessage}</aside>
                        </label>
                        <div style={{verticalAlign: "Bottom"}}>
                            <button style={{opacity: "60%", float: "Right", border: "none", borderRadius: "5px", background: "#6994A2", padding: "8px", fontFamily: "Roboto, sans-serif", fontSize: "22px", fontWeight: "bold", color: "white", cursor: "pointer"}}
                                    type="submit"
                                    value="submit"
                                    id="continue">
                                Continue
                            </button>
                        </div>
                    </GradientBox>
                </form>
            )
        }
    }
}