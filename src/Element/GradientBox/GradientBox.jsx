import React from 'react'

import classes from './GradientBox.module.css';
import backButton from "../../assets/feather-icon/chevron-left.svg";
import {
   Link, Route
} from 'react-router-dom';

const gradientBox = (props) => {
    if (props.default == true) {
      return(
        <div className={classes.GradientBoxWrapper}>
          <div className={classes.GradientBox}>
              {props.children}
          </div>
        </div>
      );
    }

    if(props.backPage !== undefined){
      return(
        <div className={classes.GradientBoxWrapper}>
          <div className={classes.GradientBox}>
            <Link to={props.backPage}>
              <button className={classes.back_button}>
                <img src={backButton}></img>
              </button>
            </Link>
              {props.children}
          </div>
        </div>
      );
    }

    else {
      return(
        <div className={classes.GradientBoxWrapper}>
          <div className={classes.GradientBox}>
            <button onClick={props.backClick} className={classes.back_button}>
              <img src={backButton}></img>
            </button>
              {props.children}
          </div>
        </div>
      );
  }
}

export default gradientBox;
