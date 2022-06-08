import React from 'react'

import classes from './PinkChannel.module.css';
import defaultPosts from "./Posts.png";


const PinkChannel = (props) => {
  let content = props.defaultPosts ? <img className={classes.default_posts} src={defaultPosts}></img> : props.children;
  return(
    <div className={classes.pink_channel}>
      <h1 className={classes.header}>{props.header}</h1>
      <div className={classes.audio_wrapper}>
        {content}
      </div>
    </div>
  );

}

export default PinkChannel;
