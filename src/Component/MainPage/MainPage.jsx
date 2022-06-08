import React from "react";
import AppMargin from "../../Element/AppMargin/AppMargin.jsx";
import FullPost from "./FullPost";
import PinkChannel from "./../../Element/PinkChannel/PinkChannel.jsx";
import imgCurl1 from "./../../assets/SplashCurl1.svg";
import imgCurl2 from "./../../assets/SplashCurl2.png";
import classes from './MainPage.module.css';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: props.userid,
            connectionsLoaded: false,
            postsLoaded: false,
            loadingAvatars: false,
            avatarsLoaded: false,
            avatarCount: 0,
            posts: [],
            connections: [],
            avatars: []
        };
    }

    componentDidMount() {
        this.loadPosts();
        this.loadConnectionList();
    }

    loadAvatars = () => {
        this.state.connections.map(id => {
            this.loadAvatar(id)
        })
    }

    loadAvatar = (id) => {
        fetch(process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + id + "&type=avatar", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            },
        })
            .then(res => res.json())
            .then(result => {
                    console.log("Line 36: RESULT ")
                    console.log(result)
                    if(result[1] === 1){
                        this.setState({
                            [`${id}`]: result[0][0].url
                        })
                    } else {
                        this.setState({
                            [`${id}`]: ""
                        })
                    }
                },
                error => {
                    this.setState({
                        error: error
                    });
                    console.log(error)
                }
            )
            .then(_ => {
                this.setState({
                    avatarCount: this.state.avatarCount+1
                })
            })
    }

    loadPosts = () => {
        let url = process.env.REACT_APP_API_PATH+"/posts";
        fetch(url, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result) {
                        console.log("Got Posts");
                        console.log(result[0])
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

    loadConnectionList = () => {
        let connectionList = []

        fetch(process.env.REACT_APP_API_PATH+"/connections?userID="+sessionStorage.getItem("user"), {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result && Array.isArray(result[0])) {
                        {result[0].map(connection => {
                            connectionList.push(connection.connectedUser.id)
                        })}
                        this.setState({
                            connections: connectionList,
                            connectionsLoaded: true
                        });
                    }
                    else {
                        this.setState({
                            error: {message: "You are not logged in."}
                        })
                    }
                    console.log("Line 111: Followers Result");
                    console.log(result);
                },
                error => {
                    this.setState({
                        error: error
                    });
                    console.log("Line 118: Error loading connections: " + error)
                }
            );
    }

    render() {
        const {posts} = this.state;
        let audioFilesCount = 0;
        let needsFillerDisplay = true;

        if (this.props.isLoggedIn) {
            if (!this.state.connectionsLoaded || !this.state.postsLoaded){
                return <div> Loading... </div>;
            }
            else if (!this.state.loadingAvatars){
                this.loadAvatars()
                this.setState({
                    loadingAvatars: true
                })
                return <div> Loading... </div>;
            } else if (!this.state.avatarsLoaded){
                console.log("Checking avatar count...")
                console.log(this.state.avatarCount)
                console.log(this.state.connections)
                if(this.state.avatarCount === this.state.connections.length){
                    this.setState({
                        avatarsLoaded: true
                    })
                }
                return <div> Loading... </div>;
            }
            else if(this.state.connections.length === 0){
                return(
                    <AppMargin>
                        <h1 className={classes.main_logo}>Sense</h1>
                        <h2 className={classes.description}>An ASMR Platform</h2>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <h3 style={{textAlign: "center"}}>This is the timeline. When you follow other users, their posts will appear here!</h3>
                    </AppMargin>
                )
            }
            else {
                return (
                    <AppMargin>
                        <h1 className={classes.home_header}>{this.props.pageName}</h1>
                        <p className={classes.recent}>Recently Posted</p>
                        {posts.map(post => {
                            if (post.parent === null && post.type === "post" && this.state.connections.includes(post.author.id)) {
                                console.log("Line 169: Prop avatar: ")
                                console.log(`${post.author.id}`)
                                console.log(this.state[`${post.author.id}`])
                                let node = <FullPost user={post.author.username}
                                                     avatar={this.state[`${post.author.id}`]}
                                                     title={post.content}
                                                     description={post.content}
                                                     // img={post.thumbnailURL === "" ? "" : process.env.REACT_APP_API_PATH.slice(0, -4) + post.thumbnailURL}
                                                     img={post.thumbnailURL === "" ? "" : "https://webdev.cse.buffalo.edu" + post.thumbnailURL}
                                                     // audio={process.env.REACT_APP_API_PATH.slice(0, -4) + JSON.parse(post.content).audio_url}
                                                     audio={post.content}
                                                     audioID={"audio" + audioFilesCount}
                                />
                                audioFilesCount += 1
                                needsFillerDisplay = false
                                return (node)
                            }
                            if(posts.indexOf(post) === posts.length-1 && needsFillerDisplay){
                                console.log("Line 166 hit")
                                let node = <h3 style={{textAlign: "center"}}>This is the timeline. When you follow other users, their posts will appear here!</h3>
                                return(node)
                            }
                        })}
                    </AppMargin>
                )
            }
        } else {
            if (!this.state.postsLoaded) {
                return <div> Loading... </div>;
            } else {
                return (
                    <AppMargin>
                      <img className={classes.curly_line__right} src={imgCurl2}></img>
                        <h1 className={classes.main_logo}>Sense</h1>
                        <h2 className={classes.description}>An ASMR Platform</h2>
                        <div className={classes.message}>
                          <br/>
                          <br/>
                          <br/>
                          <br/>
                          <h3 style={{textAlign: "center"}}>To view posts please use the NavBar, at the top of the page, to Sign Up or Log In.</h3>
                          <br/>
                          <br/>
                          <br/>
                          <br/>
                        </div>
                      </AppMargin>
                )
            }
        }
    }

}

export default MainPage;
