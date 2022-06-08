import React from 'react'

import classes from './ButtonPrimary.module.css';

const buttonPrimary = (props) => {
    return(
      <div className={classes.button__wrapper}>
        <button
          /*add more attributes as needed*/
          disabled={props.disabled}
          onClick={props.onClick}
          value={props.value}
          id={props.id}
          className={props.disabled ? classes.disabled : classes.enabled}
          >
            {props.children}
        </button>
      </div>
    );
}

export default buttonPrimary;
