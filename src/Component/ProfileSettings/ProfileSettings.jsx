import React from "react";
import "../../App.css";
import AppMargin from "../../Element/AppMargin/AppMargin";
import classes from "./ProfileSettings.module.css";
import { Redirect, Link } from "react-router-dom";
import {updatePrivacyMode} from "../Privacy/PrivacyMode.jsx";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      voiceactorid: "",
      voiceactor: false,
      vachecked: "",
      responseMessage: "",
      exist: false,
      artifactId: "",
      privacyMode: "",
      privacyid: "",
      url: ""
    };
    this.fieldChangeHandler.bind(this);
  }

  fieldChangeHandler(field, e) {
    console.log("field change");
    this.setState({
      [field]: e.target.value
    });
    console.log(this.state);
  }

  VAcheckboxHandler() {
    console.log("VA checkbox change");
    let vachecked = "";
    let voiceactor = false;
    if (this.state.voiceactor == true) {
      vachecked = "";
      voiceactor = false;
    }
    else {
      vachecked = "checked";
      voiceactor = true;
    }
    this.setState({
      "voiceactor": voiceactor,
      "vachecked": vachecked
    });
    console.log(this.state);
    console.log(vachecked);
  }

  // prefChangeHandler(field, e) {
  //   console.log("pref field change " + field);
  //   const prefs1 = JSON.parse(JSON.stringify(this.state.favoritecolor));
  //   console.log(prefs1);
  //   prefs1.value = e.target.value;
  //   console.log(prefs1);

  //   this.setState({
  //     [field]: prefs1
  //   });
  // }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + sessionStorage.getItem("user") + "&type=avatar", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
    }).then(res => res.json())
      .then(
        result => {
          if (result[1] !== 0) {
            this.setState({
              url: result[0][0].url,
              artifactId: result[0][0].id,
              exist: true,
            })
          }
        },
      );

    //console.log("In profile");
    //console.log(this.props);

    // first fetch the user data to allow update of username
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            //console.log(result);
            this.setState({
              // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
              // try and make the form component uncontrolled, which plays havoc with react
              email: result.email || "",
              username: result.username || ""
            });
          }
        },
        // error => {
        //   alert("error!");
        // }
      );

    //make the api call to the user API to get the user with all of their attached preferences
    fetch(process.env.REACT_APP_API_PATH + "/user-preferences?userID=" + sessionStorage.getItem("user"), {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(
        result => {
          //console.log("result");
          //console.log(result);
          if (result.length > 0) {
            //console.log("output of userpref");
            //console.log(result);

            let voiceactor = "";
            let voiceactorid = "";
            let vachecked = "";
            let privacyid = "";
            let privacy_mode = "";
            // read the user preferences and convert to an associative array for reference

            result[0].forEach(function (pref) {
              if (pref.name === "voiceactor") {
                voiceactor = pref.value;
                voiceactorid = pref.id;
                if (voiceactor == "true") {
                  vachecked = "checked";
                }
                else {
                  vachecked = "";
                }
              }
              privacyid = pref.name === "privacy_mode" ? pref.id : "";
              privacy_mode = pref.name === "privacy_mode" ? pref.value : "";
            });

            this.setState({
              // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
              // try and make the form component uncontrolled, which plays havoc with react
              voiceactor: voiceactor,
              voiceactorid: voiceactorid,
              vachecked: vachecked,
              privacyMode: privacy_mode,
              privacyid: privacyid,
            });

            //console.log(this.state);
          }
        },
        error => {
          alert("error loading userprefs!");
        }
      );
  }

  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();
    //console.log(this.state);

    //make the api call to the user controller
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.status
          });
          console.log("Updating props")
          this.props.setUpdateUsername(true)
        },
        // error => {
        //   alert("error!");
        // }
      );

    let url = process.env.REACT_APP_API_PATH + "/user-preferences";
    let method = "POST";
    let value = this.state.voiceactor;

    if (this.state.voiceactorid != "") {
      url += "/" + this.state.voiceactorid;
      method = "PATCH";
      value = this.state.voiceactor;
    }


    //make the api call to the user prefs controller
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        'userID': sessionStorage.getItem("user"),
        name: "voiceactor",
        value: value,
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
          });
        },
        error => {
          alert("error saving userpref!");
        }
      );

  };

  changeImg = event => {
    if (this.state.exist) {
      this.uploadImage(event.target.files[0])
    }
    else {
      this.createUserArtifactImage(event.target.files[0])
    }
  };

  createUserArtifactImage(x) {
    //console.log(sessionStorage.getItem("user"))
    fetch(process.env.REACT_APP_API_PATH + "/user-artifacts", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        ownerID: sessionStorage.getItem("user"),
        type: "avatar",
        url: ""
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            artifactId: result.id
          })
          this.uploadImage(x)
        },
        error => {
          alert("error!");
        }
      );
  }

  uploadImage(img_url) {
    const formData = new FormData()
    formData.append("file", img_url)
    fetch(process.env.REACT_APP_API_PATH + "/user-artifacts/" + this.state.artifactId + "/upload", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: formData
    })
    alert("Profile picture has been updated. Please refresh the page.")
  }

  updatePrivacySettings = (e) => {
    let privacyMode = e.target.value;

    this.setState({
      privacyMode: privacyMode
    });

    //make the api call to the user prefs controller
    updatePrivacyMode(this.state.privacyid, privacyMode)
  }

  confirmation() {
    const del = prompt("type DELETE in order to confirm the deletion of your account.")
    if (del === "DELETE") {
      this.DeleteAccount()
    }
    else {
      alert("Make sure all letters of the word DELETE is capitalized if you to confirm the deletion of your account.")
    }
  }

  DeleteAccount() {
    this.DeletePostTags()
    this.DeleteConnections()
    this.DeletePosts()
    this.DeleteUserPreference()
    this.DeleteUserArtifacts()
  }

  DeletePostTags() {
    fetch(
      process.env.REACT_APP_API_PATH + "/post-tags?userID=" + sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        var list = []
        if (result[1] !== 0) {
          for (var i = 0; i < result[1]; i++) {
            list.push(result[0][i].id)
          }
        }
        for (var j = 0; j < list.length; j++) {
          fetch(
            process.env.REACT_APP_API_PATH + "/post-tags/" + list[j],
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          )
        }
      },
      );
  }

  DeletePosts() {
    fetch(
      process.env.REACT_APP_API_PATH + "/posts?sort=newest&authorID=" + sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        var list = []
        if (result[1] !== 0) {
          for (var i = 0; i < result[1]; i++) {
            list.push(result[0][i].id)
          }
        }
        for (var j = 0; j < list.length; j++) {
          fetch(
            process.env.REACT_APP_API_PATH + "/posts/" + list[j],
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          )
        }
      },
      );

  }
  DeleteConnections() {
    fetch(
      process.env.REACT_APP_API_PATH + "/connections?userID=" + sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        var list = []
        if (result[1] !== 0) {
          for (var i = 0; i < result[1]; i++) {
            list.push(result[0][i].id)
          }
        }
        for (var j = 0; j < list.length; j++) {
          fetch(
            process.env.REACT_APP_API_PATH + "/connections/" + list[j],
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          )
        }
      },
      );
  }
  DeleteUserArtifacts() {
    fetch(
      process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        var list = []
        if (result[1] !== 0) {
          for (var i = 0; i < result[1]; i++) {
            list.push(result[0][i].id)
          }
        }
        for (var j = 0; j < list.length; j++) {
          fetch(
            process.env.REACT_APP_API_PATH + "/user-artifacts/" + list[j],
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          )
            .then(
              result => {
                fetch(
                  process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + sessionStorage.getItem("user"),
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                  }
                ).then((res) => res.json())
                  .then(
                    result => {
                      if (result[1] == 0) {
                        this.DeleteUser();
                      }
                    }
                  );
              }
            );
        }
        fetch(
          process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + sessionStorage.getItem("user"),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        ).then((res) => res.json())
          .then(
            result => {
              if (result[1] == 0) {
                this.DeleteUser();
              }
            }
          );
      },
      )
  }
  DeleteUserPreference() {
    fetch(
      process.env.REACT_APP_API_PATH + "/user-preferences?userID=" + sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        var list = []
        if (result[1] !== 0) {
          for (var i = 0; i < result[1]; i++) {
            list.push(result[0][i].id)
          }
        }
        for (var j = 0; j < list.length; j++) {
          fetch(
            process.env.REACT_APP_API_PATH + "/user-preferences/" + list[j],
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          )
        }
      },
      );
  }
  DeleteUser() {
    fetch(
      process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then(
      result => {
        sessionStorage.setItem("token", "");
        sessionStorage.setItem("user", "");
        var con = window.confirm('Your Account has been Deleted. Would you like to be redirected to the home page?')
        if (con) {
          window.location.href = '/home';
        }
        else {
          window.location.href = '/register-account';
        }
      },
      error => {
        alert("error!" + error);
      }
    );

    //console.log(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"))
    //sessionStorage.setItem("token", "");
    //sessionStorage.setItem("user", "");



  }
  render() {
    let isPrivate = this.state.privacyMode == "private" ? true : false;
    let isPublic = this.state.privacyMode == "public" ? true : false;
    return (
      <AppMargin>
        <h1>Settings</h1>
        <h2>Personal Information</h2>
        <table style={{ margin: "0 auto" }}>
          <tr>
            <td>
              <div>
                <img className="WrapImage" src={"https://webdev.cse.buffalo.edu" + this.state.url} alt="" />
                <input type="file" name="img" accept="image/*" onChange={this.changeImg}></input>
              </div>
            </td>
            <td className="profileForm">
              <form onSubmit={this.submitHandler}>
                <label>
                  Email
                  <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("email", e)}
                    value={this.state.email}
                  />
                </label>
                <label>
                  Username
                  <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("username", e)}
                    value={this.state.username}
                  />
                </label>
                <label>
                  Voice Actor
                  <input
                    type="checkbox"
                    onChange={e => this.VAcheckboxHandler()}
                    checked={this.state.vachecked}
                  />
                </label>
                <input type="submit" value="Submit" style={{ color: "white", background: "#85A9B3", padding: "10px 70px", borderRadius: "15px", cursor: "pointer", textDecoration: "none", fontFamily: "Roboto, sans-serif" }} />
                <br />
                <br />
              </form>
              <button style={{ color: "white", background: "#85A9B3", padding: "10px 70px", borderRadius: "15px", cursor: "pointer", textDecoration: "none", fontFamily: "Roboto, sans-serif", width: "100%", height: "36px" }} onClick={() => window.location.href = '/password-reset'}>Navigate to Password Reset</button>
            </td>
          </tr>
        </table>

        <h2>Account Preferences</h2>
        <h3>Privacy</h3>
        <div className={classes.privacy_settings}>
          <label>
            <input type="radio" name="privacy" id="pm-public" value="public" checked={isPublic} onChange={this.updatePrivacySettings} />
            Public
          </label>
          <label>
            <input type="radio" name="privacy" id="pm-private" value="private" checked={isPrivate} onChange={this.updatePrivacySettings} />
            Private
          </label>
          <br />
        </div>
        <br />
        <div>
          <button className="delete" onClick={this.confirmation.bind(this)}>Delete Account</button>
        </div>
      </AppMargin>
    );
  }
}
