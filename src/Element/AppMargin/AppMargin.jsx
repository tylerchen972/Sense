import React from 'react'

import classes from './AppMargin.module.css';

const AppMargin = (props) => {

  return(
    <div className={classes.app_wrapper}>
      <div className={classes.app_content}>
        {props.children}
      </div>
    </div>
  );

}

export default AppMargin;
