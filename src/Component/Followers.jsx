import React from "react";
import "../App.css";
import AppMargin from "../Element/AppMargin/AppMargin";


export default class FollowersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.userid,
      connections: [],
      isLoaded: false,
      error: ""
    };
  }

  componentDidMount() {
    this.loadFollowers();
  }

  loadFollowers() {

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
            this.setState({
              isLoaded: true,
              connections: result[0]
            });
          }
          else {
              this.setState({
                  isLoaded: true,
                  error: {message: "You are not logged in."}
              })
          }
          //console.log("Followers Result");
          //console.log(result);
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
    const connections = this.state.connections;

    if (error) {
      return <AppMargin><div> Error: {error.message} </div></AppMargin>;
    } else if (!isLoaded) {
      return <AppMargin><div> Loading... </div></AppMargin>;
    } else if (connections.length == 0) {
      return <AppMargin><div> You have no followers. </div></AppMargin>;
    } else {
      return (
        <AppMargin>
          <h1>Followers</h1>
        <div className="post">
          <ul>
            {connections.map(connection => (
              <div key={connection.id} className="userlist">
                {connection.connectedUser.username} - {connection.status}
              </div>
            ))}
          </ul>
        </div>
        </AppMargin>
      );
    }
  }
}
