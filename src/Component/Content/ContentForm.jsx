import React from "react";
import "../../App.css";
import ContentList from "./ContentList.jsx";
import GradientBox from './../../Element/GradientBox/GradientBox.jsx';
import AppMargin from './../../Element/AppMargin/AppMargin.jsx';
import ButtonPrimary from './../../Element/ButtonPrimary/ButtonPrimary.jsx';
import uploadIcon from "../../assets/feather-icon/upload.svg";
import imgTemplate from "../../assets/upload_image_template.png";
import {getPrivacyMode, createPostPrivacy} from "../Privacy/PrivacyMode.jsx";

import classes from './ContentForm.module.css';

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class ContentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post_text: "",
            description:"",
            user_feedback: "",
            content_img: "",
            content_audio: "",
            img_url: "",
            img_id: "",
            audio_url: "",
            audio_id: "",
            tag0: false,
            tag1: false,
            tag2: false,
            tag3: false,
            upload_enabled: true,
            record_enabled: false,
        };
        this.postListing = React.createRef();
    }

    // the handler for submitting a new post.  This will call the API to create a new post.
    // while the test harness does not use images, if you had an image URL you would pass it
    // in the thumbnailURL field.
    submitHandler = event => {

        //keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        //console.log(this.createPost())
        this.createUserArtifactAudio()

    };

    createPost(){

        console.log(this.state);

        fetch(process.env.REACT_APP_API_PATH+"/posts", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: JSON.stringify({
                    "title" : this.state.post_text,
                    "img_id": this.state.img_id,
                    "audio_url": this.state.audio_url,
                    "audio_id": this.state.audio_id,
                    "description": this.state.description
                }),
                thumbnailURL: this.state.img_url,
                type: "post",
            })
        })
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                        user_feedback: result.Status,
                    });

                    // once post is created, add tags and add privacy tag
                    this.addPostTags(result.id)
                    getPrivacyMode().then(pref => {
                      let privacyMode = pref.value;
                      createPostPrivacy(result.id, privacyMode);
                    });


                    alert("Post Uploaded! You Can Check under [Your Posts]");
                },
                error => {
                    alert("error!");
                }
            );
    }

    createUserArtifactAudio(){
        if(this.state.content_audio != ""){
            //console.log(sessionStorage.getItem("user"))
            fetch(process.env.REACT_APP_API_PATH+"/user-artifacts", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    ownerID: sessionStorage.getItem("user"),
                    type: "audio",
                    url: "",
                    category: "post",
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        //console.log(result.id)
                        this.setState({
                            audio_id: result.id,
                        });
                        this.uploadAudio(result.id)
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
        else{
            alert("No Audio!");
        }
    }

    uploadAudio(aud_id){

        const formData = new FormData
        //console.log(process.env.REACT_APP_API_PATH+"/user-artifacts/" + aud_id + "/upload")
        //console.log(this.state.content_audio)

        var file = new File([this.state.content_audio], "record.mp3");
        //console.log(file)
        //Recorded audio should appear on backend, an example:
        //http://localhost:3001/uploads/user-artifacts/JVBT8QfYBBBN55EQI-3r8NBuw79TtpAT5LaxjrUSfac.mp3

        formData.append("file",file)
        fetch(process.env.REACT_APP_API_PATH+"/user-artifacts/" + aud_id + "/upload", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: formData
        }).then(res => res.json())
            .then(
                result => {
                    //console.log(result.url)
                    this.setState({
                        audio_url: result.url,
                    });

                    if(this.state.content_img != ""){
                        this.createUserArtifactImage()
                    }
                    else{
                        this.createPost()
                    }

                },
                error => {
                    alert("Error uploading audio!");
                }
            );
    }

    addPostTags(post_id) {
        if (this.state.tag0) {
            fetch(process.env.REACT_APP_API_PATH + "/post-tags", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    "postID": post_id,
                    "userID": sessionStorage.getItem("user"),
                    "name": "whispering",
                    "type": "whispering"
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        console.log("Applied Tag -whispering- to Post.")
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
        if (this.state.tag1) {
            fetch(process.env.REACT_APP_API_PATH + "/post-tags", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    "postID": post_id,
                    "userUD": sessionStorage.getItem("user"),
                    "name": "tapping",
                    "type": "tapping"
                })
            }).then(res => res.json())
                .then(
                    result => {
                        console.log("Applied Tag -tapping- to Post.")
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
        if (this.state.tag2) {
            fetch(process.env.REACT_APP_API_PATH + "/post-tags", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    "postID": post_id,
                    "userUD": sessionStorage.getItem("user"),
                    "name": "crinkling",
                    "type": "crinkling"
                })
            }).then(res => res.json())
                .then(
                    result => {
                        console.log("Applied Tag -crinkling- to Post.")
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
        if (this.state.tag3) {
            fetch(process.env.REACT_APP_API_PATH + "/post-tags", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    "postID": post_id,
                    "userUD": sessionStorage.getItem("user"),
                    "name": "humming",
                    "type": "humming"
                })
            }).then(res => res.json())
                .then(
                    result => {
                        console.log("Applied Tag -humming- to Post.")
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
    }



    createUserArtifactImage(){
        if(this.state.content_img != ""){
            //console.log(sessionStorage.getItem("user"))
            fetch(process.env.REACT_APP_API_PATH+"/user-artifacts", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    ownerID: sessionStorage.getItem("user"),
                    type: "image",
                    url: "",
                    category: "post",
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        //console.log(result.id)
                        this.setState({
                            img_id: result.id,
                        });
                        this.uploadImage(result.id)
                    },
                    error => {
                        alert("error!");
                    }
                );
        }
        else{
            alert("No Image!");
        }
    }

    uploadImage(img_id){

        const formData = new FormData
        //console.log(process.env.REACT_APP_API_PATH+"/user-artifacts/" + img_id + "/upload")

        formData.append("file", this.state.content_img)
        fetch(process.env.REACT_APP_API_PATH+"/user-artifacts/" + img_id + "/upload", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: formData
        }).then(res => res.json())
            .then(
                result => {
                    //console.log(result.url)
                    this.setState({
                        img_url: result.url,
                    });
                    this.createPost()
                },
                error => {
                    alert("error!");
                }
            );
    }


    changeImg = event => {
        let picture = event.target.files[0];
        this.setState({
            content_img: picture
        });
        //render image in image preview area
        if (picture.type.startsWith('image/')){
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                //img.src = event.target.result;
                document.getElementById("image_preview").setAttribute('src', event.target.result);
            });
            reader.readAsDataURL(picture);
        }
    };

    changeAudio = event => {
        this.setState({
            content_audio: event.target.files[0]
        });
        document.getElementById("upload-img-title").text = "Uploaded: " + event.target.files[0].name;
    };

    titleHandler = event => {
        this.setState({
            post_text: event.target.value
        });
    };

    descriptionHandler = event => {
        this.setState({
            description: event.target.value
        });
    }

    updateTag0 = () => {
        this.setState({tag0: !(this.state.tag0)});
    }
    updateTag1 = () => {
        this.setState({tag1: !(this.state.tag1)});
    }
    updateTag2 = () => {
        this.setState({tag2: !(this.state.tag2)});
    }
    updateTag3 = () => {
        this.setState({tag3: !(this.state.tag3)});
    }

    uploadEnabled = (e) => {
        e.preventDefault();
        this.setState({
            upload_enabled: true,
            record_enabled: false,
        });
    }

    recordEnabled = (e) => {
        e.preventDefault();
        this.setState({
            upload_enabled: false,
            record_enabled: true,
        });
    }

    // citation: https://developers.google.com/web/fundamentals/media/recording-audio
    handleSuccess = function(stream) {
        document.getElementById("recording-progress").innerText = "Recording in progress";
        const stopButton = document.getElementById('stopButton');
        let shouldStop = false;
        let stopped = false;
        const options = {mimeType: 'audio/webm'};
        const recordedChunks = [];
        let mediaRecorder = new MediaRecorder(stream, options);


        mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        });

        let stopRecording = function(e) {
            e.preventDefault();
            shouldStop = true;
            //console.log("stopped");
            mediaRecorder.stop();
            stopButton.removeEventListener('click', stopRecording);
            document.getElementById("recording-progress").innerText = "Recording complete";
        }

        stopButton.addEventListener('click', stopRecording);

        mediaRecorder.addEventListener('stop', function() {
            stopped = true;
            //console.log('start download');
            const downloadLink = document.getElementById('download');
            const audio = document.getElementById('player');
            const audio_content = new Blob(recordedChunks, {'type': 'audio/mpeg' });
            const audio_url = URL.createObjectURL(audio_content);
            downloadLink.href = audio_url;
            downloadLink.text = 'Download recording.wav';
            downloadLink.download = 'recording.wav';
            audio.src = audio_url;
            audio.download = 'recording.wav';
            mediaRecorder = new MediaRecorder(stream, options); //reset media recorder
        });

        mediaRecorder.start();
        //console.log('started');
    }

    startRecording = (e) => {
        e.preventDefault();
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(this.handleSuccess);
    }

  uploadRecording = (e) => {
    //console.log(this.state);
    e.preventDefault();
    const audioPlayer = document.getElementById('player');
    if (audioPlayer.src) {
    let promise = fetch(audioPlayer.src).then(r => r.blob()).then(data => {
      data.lastModifiedDate = new Date();
      data.name = "recording"
      this.setState({
        content_audio: data
      });
    });

    //console.log('successfully uploaded');
    document.getElementById("upload-recording-feedback").innerText = "Successfully uploaded: recording.wav" ;
    } else {
      document.getElementById("upload-recording-feedback").innerText = "Error: nothing has been recorded" ;
    }
  }

    preventReload = (e) => {
        e.preventDefault();
    }

  render() {
    //let imgPreview = this.state.img_content ? <img src={this.state.img_content} className={classes.imgPlaceholder}  /> : null;
    let imgPreview = this.state.content_img ? this.state.content_img : imgTemplate;
    let uploadButton = this.state.upload_enabled ? <button className={classes.button_active} onClick={this.uploadEnabled} >Upload</button> : <button className={classes.button_unactive} onClick={this.uploadEnabled} >Upload</button>;
    let recordButton = this.state.record_enabled ? <button className={classes.button_active} onClick={this.recordEnabled} >Record</button> : <button className={classes.button_unactive} onClick={this.recordEnabled} >Record</button>;

        let upload_method = this.state.upload_enabled ? (
            <div className={classes.upload_audio}>
                <br/>
                <label>
                    <img src={uploadIcon} alt='upload icon'></img>
                    Upload Your Sound File
                    <input id="upload-audio" type="file" name="audio" accept="audio/*" onChange={this.changeAudio}></input>
                </label>
                <br/>
                <br/>
                <a id="upload-img-title"></a>
            </div>
        ) : (
            <div className={classes.record_audio}>
                <br/>
                <button id="recordButton" onClick={this.startRecording}>Record</button>
                <button id="stopButton">Stop</button>
                <aside id="recording-progress"></aside>
                <audio id="player" className={classes.audio_player} controls href={this.state.content_audio} controlsList="nodownload"></audio>
                <br/>
                <button onClick={this.uploadRecording}>Upload</button><a id="upload-recording-feedback"></a>
                <br/>
                <a id="download"></a>
            </div>
        );

        return(
            <AppMargin>
                <div className={classes.Gradient}>
                    <form>
                        <h1 className={classes.box__title}>Create a Post</h1>

                        <label> Title
                            <input type="text" placeholder="Name your masterpiece" onChange={this.titleHandler}></input>
                        </label>

                        <div className={classes.upload_method_wrapper}>
                            <ul className={classes.upload_method}>
                                <li>{uploadButton}</li>
                                <li>or</li>
                                <li>{recordButton}</li>
                            </ul>
                            {upload_method}
                        </div>

                        <div className={classes.upload_img} >
                            <label>
                                Choose Cover Image
                                <input  type="file" className={classes.choose_img} name="img" accept="image/*" onChange={this.changeImg}></input>
                                <br/>
                                {/*<img src={this.state.content_img} className={classes.imgPlaceholder}  />*/}
                                <img id="image_preview" src={imgPreview} alt="Preview of Uploaded Image" className={classes.imgPlaceholder}  />
                            </label>
                        </div>


                        <label>
                            Description
                            <textarea className={classes.description} onChange={this.descriptionHandler}></textarea>
                        </label>
                        <label>
                            <ul id="categories" style={{
                                display: "flex",
                                justifyContent:"space-evenly",
                                margin: "0px",
                                padding: "0px"
                            }}>
                                <label htmlFor="category1" style={{
                                    paddingRight: "20px",
                                    paddingLeft: "20px"
                                }}>
                                    <input type="checkbox" id="category1" name="category1" onChange={this.updateTag0} style={{
                                        width: "20px",
                                        height: "20px"
                                    }}/>
                                    Whispering
                                </label>

                                <label htmlFor="category1" style={{
                                    paddingRight: "20px",
                                    paddingLeft: "20px"
                                }}>
                                    <input type="checkbox" id="category1" name="category1" onChange={this.updateTag1} style={{
                                        width: "20px",
                                        height: "20px"
                                    }}/>
                                    Tapping
                                </label>

                                <label htmlFor="category3" style={{
                                    paddingRight: "20px",
                                    paddingLeft: "20px"
                                }}>
                                    <input type="checkbox" id="category3" name="category3" onChange={this.updateTag2} style={{
                                        width: "20px",
                                        height: "20px"
                                    }}/>
                                    Crinkling
                                </label>

                                <label htmlFor="category4" style={{
                                    paddingRight: "20px",
                                    paddingLeft: "20px"
                                }}>
                                    <input type="checkbox" id="category4" name="category4" onChange={this.updateTag3} style={{
                                        width: "20px",
                                        height: "20px"
                                    }}/>
                                    Humming
                                </label>
                            </ul>
                        </label>
                        {this.state.user_feedback}
                        <div className={classes.upload_post__button_wrapper}>
                            <ButtonPrimary onClick={this.submitHandler}>Upload Post</ButtonPrimary>
                        </div>

                    </form>
                </div>
            </AppMargin>
        );
    }
}
