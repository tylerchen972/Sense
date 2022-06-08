import React from "react";
import AppMargin from "../../Element/AppMargin/AppMargin.jsx";


class NotificationsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: props.userid,
            connectionsLoaded: false,
            postsLoaded: false,
            posts: [],
            connections: []
        };
    }

    componentDidMount() {
    }

    render() {

        return(
          <AppMargin>
            <h1>Notifications</h1>
          </AppMargin>
        );

      }
  }



export default NotificationsPage;
