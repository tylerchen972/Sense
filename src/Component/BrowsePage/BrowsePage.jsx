import React from "react";
import PinkChannel from "../../Element/PinkChannel/PinkChannel.jsx";
import CompactPost from "../BrowsePage/CompactPost"
import AppMargin from "../../Element/AppMargin/AppMargin";
import classes from "../BrowsePage/BrowsePage.module.css";
import defaultThumbnail from "../BrowsePage/defaultPostThumbnail.png";
import ContentPost from "../Content/ContentPost";

export default class BrowsPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: props.isLoggedIn,
            listType: props.listType,
            error: null,
            postsLoaded: false,
            tagsLoaded: false,
            posts: [],
            postTags: [],
            whispering: [],
            tapping: [],
            humming: [],
            crinkling: []
        }
        this.loadPosts = this.loadPosts.bind(this);
    }

    componentDidMount() {
        this.loadPosts();

    }

    componentDidUpdate(prevProps) {
        console.log("PrevProps "+prevProps.refresh);
        console.log("Props "+this.props.refresh);
        if (prevProps.refresh !== this.props.refresh){
            this.loadPosts();
        }
    }

    loadPosts() {
        let url = process.env.REACT_APP_API_PATH+"/posts?parentID=";
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
                        this.setState({
                            postsLoaded: true,
                            posts: result[0]
                        });
                        //console.log("Got Posts");
                        //console.log(result[0])
                        this.loadTags(result[0]);
                    }
                },
                error => {
                    this.setState({
                        postsLoaded: true,
                        error: error
                    });
                    //console.log("ERROR loading Posts" + error)
                }
            );
    }

    loadTags(posts) {
        let url = process.env.REACT_APP_API_PATH + "/post-tags";

        fetch(url, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({
                        tagsLoaded: true,
                        postTags: result[0]
                    });
                    //console.log("tags");
                    //console.log(result)
                    this.filterOutPrivatePosts(posts, result[0]);
                },
                error => {
                    this.setState({
                        tagsLoaded: true,
                        error: error
                    })
                    //console.log("ERROR loading Tags " + error)
                }
            );
    }

    filterOutPrivatePosts(posts, postTags) {
      postTags.map(tag => {
        if (tag.name == "privacy_mode" && tag.type == "private" && tag.user.id != sessionStorage.getItem("user")) {
          // check if the author of that post is friends with current user
          const otherUserId = tag.user.id;
          this.isConnected(otherUserId).then(isFollowing => {
            // result will be true (following private user) or false (not following private user)
            if (!isFollowing) {
              //if not following, filter out their posts
              let newposts = [];
              for (let i = 0; i<posts.length; i++){
                const post = posts[i];
                if (post.author.id != otherUserId){
                  newposts.push(post);
                }
              }
              //update state with new posts and postTags
              this.setState({
                posts: newposts
              });
            }
          });
        }
      })
    }

    isConnected( otherUserId) {
      return fetch(process.env.REACT_APP_API_PATH + "/connections?userID=" + sessionStorage.getItem("user") + "&connectedUserID=" + otherUserId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        }
      })
        .then((res) => res.json())
        .then((result) => {
          const isConnect = result[0].length > 0 ? true: false;
          return isConnect;
        });
    }

    render(){

        const {error, tagsLoaded, postsLoaded, postTags, posts} = this.state;
        let audioFilesCount = 0;

        if (error) {
            return <div> Error: {error.message} </div>;
        } else if(!tagsLoaded || !postsLoaded){
            return <div> Loading... </div>;
        } else {
            return (
                <AppMargin>
                    <h1 className={classes.browse_logo}>Browse</h1>
                    <p className={classes.by_category}>By Category</p>
                    <PinkChannel header="Whispering" id="whispering">
                       <ul className={classes.channel} style={{width: "inherit"}}>
                        {posts.map(post => {
                            return(postTags.map(tag => {
                                if(tag.name === "whispering" && tag.post.id === post.id){
                                    let node = <CompactPost poster={post.author.username} img={post.thumbnailURL === "" ? "" : "https://webdev.cse.buffalo.edu" + post.thumbnailURL} audio={post.content} audioID={"audio"+audioFilesCount}/>
                                    audioFilesCount += 1
                                    return(node)                                }
                            }))
                            }
                        )}
                        </ul>
                    </PinkChannel>
                    <PinkChannel header="Humming" id="humming">
                        <ul className={classes.channel} style={{width: "inherit"}}>
                            {posts.map(post => {
                                    return(postTags.map(tag => {
                                        if(tag.name === "humming" && tag.post.id === post.id){
                                            let node = <CompactPost poster={post.author.username} img={post.thumbnailURL === "" ? "" : "https://webdev.cse.buffalo.edu" + post.thumbnailURL} audio={post.content} audioID={"audio"+audioFilesCount}/>
                                            audioFilesCount += 1
                                            return(node)                                        }
                                    }))
                                }
                            )}
                        </ul>
                    </PinkChannel>
                    <PinkChannel header="Crinkling" id="crinkling">
                        <ul className={classes.channel} style={{width: "inherit"}}>
                            {posts.map(post => {
                                    return(postTags.map(tag => {
                                        if(tag.name === "crinkling" && tag.post.id === post.id){
                                            let node = <CompactPost poster={post.author.username} img={post.thumbnailURL === "" ? "" : "https://webdev.cse.buffalo.edu" + post.thumbnailURL} audio={post.content} audioID={"audio"+audioFilesCount}/>
                                            audioFilesCount += 1
                                            return(node)                                        }
                                    }))
                                }
                            )}
                        </ul>
                    </PinkChannel>
                    <PinkChannel header="Tapping" id="tapping">
                        <ul className={classes.channel}  style={{width: "inherit"}}>
                            {posts.map(post => {
                                    return(postTags.map(tag => {
                                        if(tag.name === "tapping" && tag.post.id === post.id){
                                            let node = <CompactPost poster={post.author.username} img={post.thumbnailURL === "" ? "" : "https://webdev.cse.buffalo.edu" + post.thumbnailURL} audio={post.content} audioID={"audio"+audioFilesCount}/>
                                            audioFilesCount += 1
                                            return(node)
                                        }
                                    }))
                                }
                            )}
                        </ul>
                    </PinkChannel>
                </AppMargin>
            )
        }
    }
}
