import React from "react";
import "./../../App.css";
import AppMargin from "./../../Element/AppMargin/AppMargin.jsx";
import Autocomplete from "./../Autocomplete/Autocomplete.jsx";
import classes from "./FriendForm.module.css";
import { Link } from "react-router-dom";

export default class FriendForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendname: "",
      friendid: "",
      responseMessage: "",
      users: []
    };
    this.fieldChangeHandler.bind(this);
  }

  fieldChangeHandler(field, e) {
    console.log("field change");
    this.setState({
      [field]: e.target.value
    });
  }

  selectAutocomplete(friendID) {
    this.setState({
      friendid: friendID
    })
    console.log("Set Friend ID to " + friendID)
    sessionStorage.setItem("friend", friendID)
  }

  componentDidMount() {
    //make the api call to the user API to get the user with all of their attached preferences
    fetch(process.env.REACT_APP_API_PATH + "/users/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }

    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            let names = [];

            result[0].forEach(element => { if (element.username) { names.push(element) } });

            this.setState({
              users: names,
              responseMessage: result.Status
            });
            console.log(names);
          }
        },
        // error => {
        //   alert("error!");
        // }
      );
  }

  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

    console.log("friend is ");
    console.log(this.state.friendid);


    //make the api call to the user controller
    fetch(process.env.REACT_APP_API_PATH + "/connections", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        connectedUserID: this.state.friendid,
        userID: sessionStorage.getItem("user"),
        type: "friend",
        status: "active"
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
          });
        },
        // error => {
        //   alert("error!");
        // }
      );
    sessionStorage.setItem("friend", this.state.friendid)
  };

  render() {
    return (
      <form onSubmit={this.submitHandler} className={classes.search_friends}>
        <h1>Search Users</h1>
        <label>
          Enter a username
            <Autocomplete buttonName="Find User" suggestions={this.state.users} searchPath="/friend-page" selectAutocomplete={e => this.selectAutocomplete(e)}></Autocomplete>

        </label>
        {/*<Link to="/friend-page"><button className="goToFriend">Go to Friend</button></Link>*/}
        {this.state.responseMessage}
      </form>
    );
  }
}
