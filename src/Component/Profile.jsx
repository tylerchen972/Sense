import React from "react";
import "../App.css";
import AppMargin from "../Element/AppMargin/AppMargin";
// import PopularPostsExample from "../assets/popular-posts-example.png"
import PostingList from "./PostingList";
import ContentList from "./Content/HomeContentList";
import YourContentList from "./Content/YourContentList.jsx";
import PinkChannel from "../Element/PinkChannel/PinkChannel"



export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: props.userid,
            connections: [],
            isLoaded: false,
            error: "",
            email: "",
            username: "",
            url: "",
            exist: false,
            artifactId: "",
            follow: "Follow",
            profileurl: "",
            connectionId: "",
            friendid: "",
            trueFollowersIDs: [],
            trueFollowingIDs: []
        };
    }



    componentDidMount() {
        this.loadFollowers();



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

        console.log("In profile");
        console.log(this.props);

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
                        console.log(result);
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

    }

    loadFollowers() {

        fetch(process.env.REACT_APP_API_PATH + "/connections?userID=" + sessionStorage.getItem("user"), {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result && Array.isArray(result[0])) {
                        let rawConnections = result[0];
                        let trueFollowing = [];
                        let trueFollowers = [];
                        for(let x = 0; x < rawConnections.length; x++) {
                            if(rawConnections[x]["user"]["username"] == rawConnections[x]["connectedUser"]["username"]) continue;
                            delete rawConnections[x].id;
                            if(rawConnections[x]["user"]["username"] == this.state.username) trueFollowers.push(rawConnections[x]);
                            else trueFollowing.push(rawConnections[x]);
                        }
                        let trueFollowersIDs = [];
                        let trueFollowingIDs = [];
                        for(let x = 0; x < trueFollowers.length; x++) {
                            console.log(trueFollowers[x]);
                            console.log(trueFollowers[x].user.id);
                            if(!trueFollowersIDs.includes(trueFollowers[x].user.id)) {
                                trueFollowersIDs.push(trueFollowers[x].user.id);
                            }
                        }
                        for(let x = 0; x < trueFollowing.length; x++) {
                            if(!trueFollowingIDs.includes(trueFollowing[x].connectedUser.id)) {
                                trueFollowingIDs.push(trueFollowing[x].connectedUser.id);
                            }
                        }
                        this.setState({
                            isLoaded: true,
                            trueFollowersIDs: trueFollowersIDs,
                            trueFollowingIDs: trueFollowingIDs
                        });
                    }
                    else {
                        this.setState({
                            isLoaded: true,
                            error: { message: "You are not logged in." }
                        })
                    }
                    console.log("Followers Result");
                    console.log(result);
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            );
    }

    render() {
        const error = this.state.error;
        const isLoaded = this.state.isLoaded;
        const followers = this.state.trueFollowersIDs;
        const following = this.state.trueFollowingIDs;

        if (error) {
            return <AppMargin><div> Error: {error.message} </div></AppMargin>;
        } else if (!isLoaded) {
            return <AppMargin><div> Loading... </div></AppMargin>;
        } else {
            return (
                <AppMargin>
                    <div className="bio-container">
                        <div className="bio-lCol">
                            <img className="WrapImage" src={"https://webdev.cse.buffalo.edu" + this.state.url} />
                            <h2>{this.state.username}</h2>
                This is an example bio for a user that does not have a bio set.
                <br />

                            <h2>{"Followers " + followers.length}</h2>
                            <h2>{"Following " + following.length}</h2>

                        </div>
                        <div className="bio-rCol">
                            {/* <img src={PopularPostsExample} style={{ width: "100%" }} /> */}
                            <PinkChannel defaultPosts={true} header="Popular"></PinkChannel>
                            <YourContentList isLoggedIn={this.state.isLoggedIn} refresh={this.props.refresh} type="postlist" />
                        </div>
                    </div>
                </AppMargin>
            );
        }
    }
}