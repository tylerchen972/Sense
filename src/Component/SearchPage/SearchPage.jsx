import React from "react";
import PinkChannel from "../../Element/PinkChannel/PinkChannel.jsx";
import AppMargin from "../../Element/AppMargin/AppMargin.jsx";
import classes from '../MainPage/MainPage.module.css';
import searchClasses from './SearchPage.css';

import heart from "../../assets/feather-icon/heart.svg";
import comment from "../../assets/feather-icon/comment.svg";
import bookmark from "../../assets/feather-icon/bookmark.svg";
import PostingList from "../PostingList.jsx";
import HomeContentList from "../Content/HomeContentList.jsx";


class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.userid,
    };
  }

  render() {
    if (this.props.isLoggedIn) {
      return (
        <AppMargin>
          <li class = "center">
            <h>{this.state.connectionList}</h>
            <h class = "Search-Description">Search by Entering One Tag or Username</h>
            <form onSubmit={this.submitHandler}>
                <input class = "SearchBar" type="search" onChange={this.myChangeHandler}/>
                <br />
                <input class = "Enter" type="submit" value="Search"/>
                <br />
                {this.state.postmessage}
            </form>
            </li>
        </AppMargin>
      )
    }
    else {
      return (
        <AppMargin>
          <h1 className={classes.main_logo}>Sense</h1>
          <h2 className={classes.description}>An ASMR Platform</h2>
        </AppMargin>

      )
    }
  }

}

export default MainPage;
