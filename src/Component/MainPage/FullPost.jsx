import React from 'react'
import classes from "../MainPage/Timeline.module.css";
import playButton from "../MainPage/play-button.png"
import pauseButton from "../MainPage/pause-button.png"
import audioControls from "../BrowsePage/audioControls";
import defaultAvatar from "../MainPage/defaultAvatar.png";
import defaultThumbnail from "../MainPage/defaultPostThumbnail.png";

const FullPost = (props) => {

    return(
        <li className={classes.full_post}>
            <div className={classes.card}>
            <div className={classes.header}>
              <img className={classes.avatar} src={props.avatar === "" ? defaultAvatar : ("https://webdev.cse.buffalo.edu" + props.avatar)} alt="user avatar image"/>
              <h2 className={classes.username}>{props.user}</h2>
            </div>
            <div className={classes.title}>{JSON.parse(props.title).title}</div>
            <div className={classes.description}>{JSON.parse(props.description).description}</div>
            {/*<div className={classes.categories}>{props.categories}</div>*/}
            <img className={classes.thumbnail} src={props.img === "" ? defaultThumbnail : props.img} alt={"audio track thumbnail"}/>
            <div className={classes.audio_controller} onClick={() => {
                audioControls(props.audioID);
                if(!document.getElementById(props.audioID).paused){
                    document.getElementById(props.audioID + "-pause").style.visibility = "visible"
                    document.getElementById(props.audioID + "-play").style.visibility = "hidden"
                } else {
                    document.getElementById(props.audioID + "-play").style.visibility = "visible"
                    document.getElementById(props.audioID + "-pause").style.visibility = "hidden"
                }}}>
                <img id={props.audioID + "-play"} className={classes.play_pause_button} src={playButton} alt={"play button"} style={{opacity: "75%"}}/>
                <img id={props.audioID + "-pause"} className={classes.play_pause_button} src={pauseButton} alt={"play button"} style={{visibility: "hidden", opacity: "75%"}}/>
            </div>
            <audio id={props.audioID}>
                <source src={"https://webdev.cse.buffalo.edu" + JSON.parse(props.audio)?.audio_url} type="audio/mpeg"/>
                {/*<source src={process.env.REACT_APP_API_PATH.slice(0, -4) + JSON.parse(props.audio).audio_url} type="audio/mpeg"/>*/}
            </audio>
          </div>
        </li>
    )
};

export default FullPost;
