import React from "react";
import ContentPost from "./ContentPost.jsx";

export default class ContentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: [],
      myConnections: [],
      listType: props.listType
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    this.loadPosts();
    this.loadConnections();
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
    if (this.props && this.props.parentid){
      url += this.props.parentid;
    }
    fetch(url, {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },

    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            this.setState({
              isLoaded: true,
              posts: result[0]
            });
            console.log("Got Posts");
            console.log(result[0])
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
          console.log("ERROR loading Posts")
        }
      );
  }

  loadConnections() {
    fetch(
      process.env.REACT_APP_API_PATH + "/connections/?userID=" + sessionStorage.getItem("user"),
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
            list.push(result[0][i].connectedUser.id)
          }
          this.setState({
            myConnections: list
          })
        }
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
        console.log("ERROR loading Connections")
      }
    );
  }

  render() {
    //this.loadPosts();
    const {error, isLoaded, posts} = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>;
    } else if (posts) {

      if (posts.length > 0){
      return (

        <div id = "posts" className="posts">
          
          {posts.map(post => {
            //console.log(this.state.myConnections)
            //console.log(post.author.id)
            //console.log(this.state.myConnections.includes(post.author.id))
             if(this.state.myConnections.includes(post.author.id)){
               return (<ContentPost key={post.id}  post={post} type={this.props.type} loadPosts={this.loadPosts}/>)
            }
           } 
          )}

        </div>

      );
    }else{
      return (<div> No Posts Found </div>);
    }
    } else {
      return <div> Please Log In... </div>;
    }
  }
}
