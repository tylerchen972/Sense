import React from "react";
import "../App.css";
import del from "../assets/feather-icon/x.svg";


export default class MessagePost extends React.Component {
  constructor(props) {
    super(props);
    this.post = React.createRef();
  }

 

  deletePost(id) {
    //make the api call to post
    console.log(id)
    fetch(process.env.REACT_APP_API_PATH+"/messages/"+id, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
      })
      .then(
        result => {
        },
        error => {
          alert("error!"+error);
        }
      );
  }

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete(){
    if (this.props.userID == sessionStorage.getItem("user")) {
      return(
      <img
        src={del}
        className="msgdel"
        alt="Delete Post"
        title="Delete Post"
        onClick={e => {
            if(window.confirm("Do you want to delete: " + this.props.message)){
              this.deletePost(this.props.id)
            }        
          }
        }
      />
    );
    }
    return ""; 
  }

  render() {

    return (

      <div><div className="username">{this.props.name} {this.showDelete()} </div>
          <div className="message">{this.props.message}
      </div>
      
      </div>)
  }
}
