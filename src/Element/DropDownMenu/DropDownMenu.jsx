import React from 'react'

import classes from './DropDownMenu.module.css';

class DropDownMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      showMenu: false
    };
  }

  toggleMenu = (e) => {
    /*console.log(this.state.showMenu);*/
    e.preventDefault();
    this.setState({
      clicks: this.state.clicks+1
    });
    if (this.state.clicks > 1){
      this.closeMenu();
      this.setState({
        clicks: 0
      });
    }
  }

  showMenu = (event) => {
    event.preventDefault();
    this.setState({ showMenu: true });
    window.addEventListener('click', this.toggleMenu);
  }

  closeMenu = () => {
    this.setState({ showMenu: false });
    window.removeEventListener('click', this.toggleMenu);
    /*console.log(this.state.showMenu);*/
  }
    render(){
        if (this.state.showMenu) {
        return(
          <div className={classes.dropdown_wrapper}>
            <button className={this.props.className} onClick={this.showMenu}>{this.props.linkName}</button>
            <div className={classes.dropdown_content}>
              {this.props.children}
            </div>
          </div>
        );
      } else {
        return(
          <div className={classes.dropdown_wrapper}>
            <button className={this.props.className} onClick={this.showMenu}>{this.props.linkName}</button>
          </div>
        );
      }
    }
}

export default DropDownMenu;
