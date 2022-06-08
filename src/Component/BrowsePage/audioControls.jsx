import React from 'react'

const audioControls = (id) => {
    let audio = document.getElementById(id)
    console.log("AudioHit: " + id)
    if(audio) audio.paused ? audio.play() : audio.pause()
};

export default audioControls;