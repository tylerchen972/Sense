import React, { Component } from "react";
import "../../App.css";
import AppMargin from "../../Element/AppMargin/AppMargin";
import FullPost from "../MainPage/FullPost.jsx";
import {getAvatar} from "../Avatar/Avatar.jsx";
import classes from "./FriendPage.module.css";
import {
  BrowserRouter as Router, Route, Switch, Link
} from 'react-router-dom';

export default class FriendPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      follow: "Follow",
      profileurl: "",
      connection: [],
      isLoaded: false,
      postsLoaded: false,
      avatarLoaded: false,
      connectionId: "",
      friendid: "",
      posts: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getFriend();
    this.loadPosts();
    this.getState();
    this.loadProfilePicture();
  }

  getFriend() {
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("friend"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
        .then(res => res.json())
        .then(
            result => {
              if (result) {
                this.setState({
                  username: result.username,
                });
              }
            })
  }

  loadPosts = () => {
    console.log(sessionStorage.getItem("friend"));
    fetch(process.env.REACT_APP_API_PATH + "/posts?authorID="+ sessionStorage.getItem("friend"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      }
    })
        .then(res => res.json())
        .then(
            result => {
              if (result) {
                console.log("Got Posts");
                console.log(result[0]);
                this.setState({
                  posts: result[0],
                  postsLoaded: true
                })
              }
            },
            error => {
              this.setState({
                error,
                postsLoaded: true
              });
              console.log(error)
            }
        )
  }

  loadProfilePicture() {
    let url = ""

    fetch(process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + sessionStorage.getItem("friend") + "&type=avatar", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
    }).then(res => res.json())
        .then(
            result => {
              console.log("Got Profile Picture: ")
              console.log(result)
              if (result[1] === 1) {
                url = result[0][0].url
                sessionStorage.setItem("avatar", result[0][0].url)
              }
              this.setState({
                profileurl: url,
                avatarLoaded: true
              })
            },
            error => {
              this.setState({
                error: error,
                avatarLoaded: true
              });
              console.log("Error loading user avatar: " + error)
            }
        );
  }

  getState() {
    fetch(
      process.env.REACT_APP_API_PATH + "/connections/?userID=" + sessionStorage.getItem("user") + "&connectedUserID=" + sessionStorage.getItem("friend"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {
        console.log("Got State: ")
        console.log(result)
        if (result[1] !== 0) {
          sessionStorage.setItem("connectionId", result[0][0].id)
          this.setState({
            follow: "Following",
          });
        }
      });
  }

  handleClick() {
    if (this.state.follow === "Follow") {
      fetch(process.env.REACT_APP_API_PATH + "/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          connectedUserID: sessionStorage.getItem("friend"),
          userID: sessionStorage.getItem("user"),
          type: "Follow",
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            this.setState({
              follow: "Following",
              connectionId: result.id,
            });
            // sessionStorage.setItem("connectionId", result.id);
            // sessionStorage.setItem(sessionStorage.getItem("friend"), "Following")
            // localStorage.setItem("follow", "Following");
          }
        });
    } else if (this.state.follow === "Following") {
      fetch(
        process.env.REACT_APP_API_PATH +
        "/connections/" +
        sessionStorage.getItem("connectionId"),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            connectionId: sessionStorage.getItem("connectionId"),
          }),
        }
      );
      this.setState({
        follow: "Follow",
        connectionId: "",
      });
    }
  }

  render() {
    const {posts} = this.state;
    let audioFilesCount = 0;

    let following = <button className={classes.following} type="button" onClick={this.handleClick}>{this.state.follow}</button>
    let follow = <button className={classes.follow} type="button" onClick={this.handleClick}>{this.state.follow}</button>

    let followBtn = (this.state.follow === "Following" ? following : follow);

    if(!this.state.postsLoaded || !this.state.avatarLoaded) {
      return <div> Loading... </div>;
    } else {
      if(posts === 0) {
        return (
            <div className={classes.profile_page__wrapper}>
              <div className={classes.profile_page}>
                <div className={classes.profile_info__wrapper}>
                  <div className={classes.profile_info}>
                    <div className={classes.profile_picture__wrapper}>
                      <img src={"https://webdev.cse.buffalo.edu" + this.state.profileurl}/>
                    </div>
                    <label className={classes.profile_username}>{this.state.username}</label>
                    <div className={classes.buttons__wrapper}>
                      {followBtn}
                      <Link to="/message">
                        <button className={classes.message} type="button" className="">Message</button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={classes.profile_content__wrapper}>
                  <div className={classes.profile_content}>
                    <div className={classes.content__posts}>
                      <div className={classes.no_posts}><p>Nothing posted... yet</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)
      }
      else {
        return (
            <div className={classes.profile_page__wrapper}>
              <div className={classes.profile_page}>
                <div className={classes.profile_info__wrapper}>
                  <div className={classes.profile_info}>
                    <div className={classes.profile_picture__wrapper}>
                      <img src={"https://webdev.cse.buffalo.edu" + this.state.profileurl}/>
                    </div>
                    <label className={classes.profile_username}>{this.state.username}</label>
                    <div className={classes.buttons__wrapper}>
                      {followBtn}
                      <Link to="/message">
                        <button className={classes.message} type="button">Message</button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={classes.profile_content__wrapper}>
                  <div className={classes.profile_content}>
                    <div className={classes.content__posts}>
                      {posts.map(post => {
                        if (post.parent === null) {
                          let node = <FullPost user={post.author.username}
                                               avatar={this.state.profileurl}
                                               title={post.content}
                                               description={post.content}
                              // img={post.thumbnailURL === "" ? "" : process.env.REACT_APP_API_PATH.slice(0, -4) + post.thumbnailURL}
                                               img={post.thumbnailURL === "" ? "" : "https://webdev.cse.buffalo.edu" + post.thumbnailURL}
                              // audio={process.env.REACT_APP_API_PATH.slice(0, -4) + JSON.parse(post.content).audio_url}
                                               audio={post.content}
                                               audioID={"audio" + audioFilesCount}
                          />
                          audioFilesCount += 1
                          return (node)
                      }})}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )
      }
    }
  }
}
