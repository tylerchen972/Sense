import React from "react";
import "../App.css";
import MessagePost from "./MessagePost.jsx"

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            messageHistory: [],
        };

    }
    intervalId;

    componentDidMount() {
        this.getMessageHistory();
        this.intervalId = setInterval(() => { this.getMessageHistory(); }, 1000);
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.intervalId);
    }

    handleKeypress = (event) => {
        //If user presses Enter
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    };
    updateMessage = (event) => {
        this.setState({ message: event.currentTarget.value });
    }

    sendMessage() {
        fetch(process.env.REACT_APP_API_PATH + "/messages",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    authorID: sessionStorage.getItem("user"),
                    content: this.state.message,
                    recipientUserID: sessionStorage.getItem("friend")
                }),
            }
        ).then((res) => res.json())
            .then((result) => {
                this.getMessageHistory()
            },
                this.setState({
                    message: ""
                })

            );
    }

    getMessageHistory() {

        fetch(process.env.REACT_APP_API_PATH + "/messages",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {
                var list = []
                if (result[1] !== 0) {
                    //console.log(result[0])
                    //console.log(result[1])
                    //console.log(result[0].length)
                    for (var i = 0; i < result[1]; i++) {
                        //console.log(result[0][i])
                        if(result[0][i].recipientUser != null){
                            if (result[0][i].author.id == sessionStorage.getItem("user") &&
                                result[0][i].recipientUser.id == sessionStorage.getItem("friend")) {
                                list.push(result[0][i])
                            }
                            else if (result[0][i].author.id == sessionStorage.getItem("friend") &&
                                result[0][i].recipientUser.id == sessionStorage.getItem("user")) {
                                list.push(result[0][i])
                            }
                        }

                    }
                    //console.log(list)
                }
                this.setState({
                    messageHistory: list
                })
            },
            );
    }

    //For testing purposes Only, Delete this when done
    clearBackend() {
        fetch(
            process.env.REACT_APP_API_PATH + "/messages?authorID=" + sessionStorage.getItem("user"),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {
                var list = []
                if (result[1] !== 0) {
                    for (var i = 0; i < result[1]; i++) {
                        list.push(result[0][i].id)
                    }
                }
                for (var j = 0; j < list.length; j++) {
                    fetch(
                        process.env.REACT_APP_API_PATH + "/messages/" + list[j],
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + sessionStorage.getItem("token"),
                            },
                        }
                    )
                }
            },
            );
        alert("Backend Cleared")
    }

    render() {
        const { messageHistory } = this.state;
        if (messageHistory != null) {

            return (
                <div>
                    <div>

                        {messageHistory.map(message => {
                            return (
                                <MessagePost key={message.id} userID={message.author.id} id={message.id} name= {message.author.username}  message={message.content} />)
                        }
                        )}
                    </div>
                    <div className="border">
                        <input type="text" onChange={this.updateMessage} value={this.state.message} id="message" onKeyDown={this.handleKeypress} />
                    </div>
                    <br />
                    <button className="send" onClick={this.sendMessage.bind(this)}>Send</button>
                    {/* <button onClick={this.clearBackend.bind(this)}>Clear Backend Messages</button> */}
                </div>
            );

        }
        else {
            return (
                <div>
                    <div className="border">
                        <input type="text" onChange={this.updateMessage} value={this.state.message} id="message" onKeyDown={this.handleKeypress} />
                    </div>
                    <br />
                    <button className="send" onClick={this.sendMessage.bind(this)}>Send</button>
                    {/* <button onClick={this.clearBackend.bind(this)}>Clear Backend Messages</button> */}
                </div>
            );
        }
    }
}
