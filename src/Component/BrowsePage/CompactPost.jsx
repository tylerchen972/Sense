import React from 'react'
import classes from "../BrowsePage/BrowsePage.module.css";
import audioControls from "./audioControls";
import playButton from "../BrowsePage/play-button.png"
import defaultThumbnail from "../MainPage/defaultPostThumbnail.png";
import pauseButton from "../BrowsePage/pause-button.png"


const CompactPost = (props) => {
    return(
        <li className={classes.compact_post} onClick={() => {
            audioControls(props.audioID);
            if (!document.getElementById(props.audioID).paused) {
                document.getElementById(props.audioID + "-pause").style.visibility = "visible"
                document.getElementById(props.audioID + "-play").style.visibility = "hidden"
            } else {
                document.getElementById(props.audioID + "-play").style.visibility = "visible"
                document.getElementById(props.audioID + "-pause").style.visibility = "hidden"
            }}}>
            <div className={classes.thumbnail}>
                <img src={props.img === "" ? defaultThumbnail : props.img} style={{objectFit: "cover", width: 125, height: 125, borderRadius: 15}} alt={"A Post"}/>
                <img id={props.audioID + "-play"} src={playButton} style={{position: "absolute", left: 34, top: 34, width: 57, height: 57, opacity: "75%"}} alt={"A Play symbol"}/>
                <img id={props.audioID + "-pause"} src={pauseButton} style={{visibility: "hidden", position: "absolute", left: 34, top: 34, width: 57, height: 57, opacity: "75%"}} alt={"A Pause symbol"}/>
                <div className={classes.poster}>{props.poster}</div>
                <audio id={props.audioID} style={{position: "absolute", width: "100%", height: "100%"}}>
                    <source
                        src={"https://webdev.cse.buffalo.edu" + JSON.parse(props.audio).audio_url} type="audio/mpeg"/>
                </audio>
            </div>
        </li>
    )
};

export default CompactPost;