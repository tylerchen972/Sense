import React from "react";
import "../../App.css";
import AccountLogOut from "./../AccountLogOut/AccountLogOut.jsx";
import DropDownMenu from "../../Element/DropDownMenu/DropDownMenu";

import classes from './NavMenu.module.css';
import {
   Link
} from 'react-router-dom';

// pull in the images for the menu items
import senseLogo from "../../assets/senseLogo.svg";
import noUpdate from "../../assets/feather-icon/noUpdate.svg";
import newUpdate from "../../assets/feather-icon/newUpdate.svg";

class NavMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      email: "",
      userid: props.userid,
      postMenu: false
    };
    this.navMenu = React.createRef();
    this.removeId = this.removeId.bind(this);
    this.addId = this.addId.bind(this);
}
  componentDidMount() {
    /*console.log("Nav Menu Is Checking User Info From ID");
    console.log(this.props);*/

    // first fetch the user data to allow update of username
    fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
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
                /*console.log(result);*/
                this.setState({
                  // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                  // try and make the form component uncontrolled, which plays havoc with react
                  email: result.email || "",
                  username: result.username || ""
                });
                this.props.setUpdateUsername(false);
              }
            },
            // error => {
            //   alert("error!");
            // }
        );
  }

  removeId = () =>{
    this.setState({
      userid: ''
    });
  }

  addId = (id) => {
    this.setState({
      userid: id
    });
  }

  render() {
    if (this.props.isLoggedIn) {
      if(this.state.username == null || this.state.username === "" || this.props.usernameUpdated){
        this.componentDidMount()
      }

      return (
          <nav className={classes.navmenu}>
            <div className={classes.navmenu__wrapper}>
                <Link to="/home" className={classes.navmenu__item_login}>
                  <img  id="logo"  src={senseLogo} alt="Sense Logo - go to Home" title="Sense"></img>
                </Link>
                <div className={classes.navmenu__item_login}>
                  <ul className={classes.website_menu}>
                    <li>
                      <Link className={classes.navmenu__link_login} to="/home">Home</Link>
                    </li>
                    <li>
                      <Link className={classes.navmenu__link_login} to="/browse">Browse</Link>
                    </li>
                    <li>
                      <DropDownMenu linkName="Social" className={classes.navmenu__link_login}>
                        <Link className={classes.navmenu__link_login} to="/Friends">Friends</Link>
                        <Link className={classes.navmenu__link_login} to="/group">Groups</Link>
                      </DropDownMenu>
                    </li>
                    <li>
                      <DropDownMenu linkName="Post" className={classes.navmenu__link_login}>
                        <Link to="/upload">Create Post</Link>
                        <Link to="/yourpost">Your Posts</Link>
                      </DropDownMenu>
                    </li>
                  </ul>
                </div>
                <div className={classes.navmenu__item_login}>
                  <ul className={classes.user_menu}>
                    {/*// TODO: implement notificatons button later
                      <li>
                      <Link className={classes.navmenu__link_login} to="/notifications"><img className={classes.updates} src={noUpdate}></img></Link>
                    </li>*/}
                    <li >
                      <div className={classes.navmenu__account_wrapper}>
                        <DropDownMenu linkName={this.state.username} className={classes.navmenu__account_dropdown}>
                          <Link className={classes.navmenu__link_login} to="/profile">Profile</Link>
                          <Link className={classes.navmenu__link_login} to="/settings">Settings</Link>
                          <Link className={classes.navmenu__link_login} to="/logout">Log Out</Link>
                        </DropDownMenu>
                      </div>
                    </li>
                  </ul>
                </div>
            </div>
          </nav>
        );
    } else {
    return (
        <nav className={classes.navmenu}>
          <div className={classes.navmenu__wrapper}>
            <Link to="/">
              <img className={classes.navmenu__item} id="logo"  src={senseLogo} alt="Sense Home" title="Sense"></img>
            </Link>
          <div className={classes.navmenu__item}>
            <ul>
              <li>
                <Link className={classes.navmenu__link} to="/register-account">Sign Up</Link>
              </li>
              <li>
                <Link className={classes.navmenu__link} to="/login">Log In</Link>
              </li>
            </ul>
            </div>
          </div>
        </nav>
      );
    }
  }


}
export default NavMenu;
