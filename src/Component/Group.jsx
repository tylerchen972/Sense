import React from "react";
import "../App.css";
import AppMargin from "../Element/AppMargin/AppMargin.jsx";
import classes from './MainPage/MainPage.module.css';
import {
    BrowserRouter as Router, Route, Switch, Link
} from 'react-router-dom';

export default class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: "",
            groups: [],
        };
    }

    componentDidMount() {
        this.GetMyGroups()
    }

    updateGroup = event => {

        this.setState({
            group: event.currentTarget.value
        });
        //console.log(this.state.group)

    }

    GetMyGroups() {

        fetch(process.env.REACT_APP_API_PATH + "/group-members?userID=" + sessionStorage.getItem("user"),
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {
                var group = []
                if (result[1] != 0) {
                    for (var i = 0; i < result[1]; i++) {
                        console.log(result[0][i].group.name)
                        group.push(result[0][i])
                    }
                }
                this.setState({
                    groups: group
                })

            });

    }

    //Get Group ID then Get Member ID for that group if it exists. 
    //If it does it will say you are already a member. 
    //Otherwise it will Create a Group Membership
    joinGroup = () => {
        var GroupID
        fetch(process.env.REACT_APP_API_PATH + "/groups?name=" + this.state.group,
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {
                console.log(result)
                if (result[1] !== 0) {
                    GroupID = result[0][0].id
                    fetch(process.env.REACT_APP_API_PATH + "/group-members?userID=" + sessionStorage.getItem("user") + "&groupID=" + result[0][0].id,
                        {
                            method: "Get",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + sessionStorage.getItem("token"),
                            },
                        }
                    ).then((res) => res.json())
                        .then((result) => {
                            if (result[1] == 0) {
                                fetch(process.env.REACT_APP_API_PATH + "/group-members",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                                        },
                                        body: JSON.stringify({
                                            userID: sessionStorage.getItem("user"),
                                            groupID: GroupID,
                                            type: "member"
                                        }),
                                    }
                                )
                                alert("You have joined the group. Please refresh the page.")
                            }
                            else {
                                alert("Already a member")
                            }
                        });
                }
            });

    }


    //Fetch group ID ten Fetch member ID using Group ID then Delete
    leaveGroup = () => {

        fetch(process.env.REACT_APP_API_PATH + "/groups?name=" + this.state.group,
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {

                if (result[1] !== 0) {
                    console.log(result[0][0].id)
                    fetch(process.env.REACT_APP_API_PATH + "/group-members?userID=" + sessionStorage.getItem("user") + "&groupID=" + result[0][0].id,
                        {
                            method: "Get",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + sessionStorage.getItem("token"),
                            },
                        }
                    ).then((res) => res.json())
                        .then((result) => {

                            if (result[1] !== 0) {

                                fetch(process.env.REACT_APP_API_PATH + "/group-members/" + result[0][0].id,
                                    {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                                        },
                                    }
                                )
                            }
                        });
                }
            });
        alert("You have left the group. Please refresh the page.")
    }

    //Check if Group exists then creates Group and Create Founder Group Member using Group ID
    createGroup = () => {

        fetch(process.env.REACT_APP_API_PATH + "/groups?name=" + this.state.group,
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {

                if (result[1] == 0) {
                    //console.log(this.state.group)
                    fetch(process.env.REACT_APP_API_PATH + "/groups",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + sessionStorage.getItem("token"),
                            },
                            body: JSON.stringify({
                                ownerID: sessionStorage.getItem("user"),
                                name: this.state.group,
                                type: "group"
                            }),
                        }
                    ).then((res) => res.json())
                        .then((result) => {

                            fetch(process.env.REACT_APP_API_PATH + "/group-members",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                                    },
                                    body: JSON.stringify({
                                        userID: sessionStorage.getItem("user"),
                                        groupID: result.id,
                                        type: "Founder"
                                    }),
                                }
                            )
                        });
                    alert("You have created the group. Please refresh the page.")

                }
                else {
                    alert("Group Exists")
                }
            });

    }

    //Get Group ID and check if Founder then delete
    DeleteGroup = () => {
        var GroupID
        fetch(process.env.REACT_APP_API_PATH + "/groups?name=" + this.state.group,
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            }
        ).then((res) => res.json())
            .then((result) => {

                if (result[1] !== 0) {
                    console.log(result[0][0].id)
                    GroupID = result[0][0].id

                    fetch(process.env.REACT_APP_API_PATH + "/group-members?userID=" + sessionStorage.getItem("user") + "&groupID=" + result[0][0].id + "&type=Founder",
                        {
                            method: "Get",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + sessionStorage.getItem("token"),
                            },
                        }
                    ).then((res) => res.json())
                        .then((result) => {

                            if (result[1] !== 0) {
                                fetch(process.env.REACT_APP_API_PATH + "/groups/" + GroupID,
                                    {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                                        },
                                    })
                                alert("You have deleted the group. Please refresh the page.")
                            }
                            else {
                                alert("You did not delete this Group")
                            }
                        });

                }
            });
    }
    setStorage(id) {
        sessionStorage.setItem("groupID", id)
    }


    render() {
        const { groups } = this.state;
        console.log(groups.length != 0)
        if (groups.length != 0) {
            return (
                <AppMargin>
                    <li class="center">
                        <h>{this.state.connectionList}</h>
                        <h class="Search-Description">Create a Group</h>
                        <div className="border">
                            <input id="Create" type="text" onChange={this.updateGroup} />
                        </div>
                        <button className="createGroup" onClick={this.createGroup}>Create!</button>
                        <button className="deleteGroup" onClick={this.DeleteGroup}>[Delete Group]</button>

                    </li>

                    <li class="center">
                        <h>{this.state.connectionList}</h>
                        <h class="Search-Description">Join a Group</h>
                        <div className="border">
                            <input id="join" type="text" onChange={this.updateGroup} />
                        </div>
                        <button className="createGroup" onClick={this.joinGroup}>Join!</button>
                        <button className="deleteGroup" onClick={this.leaveGroup}>Leave</button>

                    </li>

                    <li class="center">
                        <h>{this.state.connectionList}</h>
                        <h class="Search-Description">Your Groups</h>

                        {groups.map(group => {
                            return (
                                <div>
                                    <p>{group.group.name} <Link to="/groupmessages"> <button type="button" className="createGroup" onClick={() => this.setStorage(group.group.id)}> View Messages</button> </Link></p>
                                </div>)
                        })}
                    </li>
                </AppMargin >
            )
        }
        else {
            return (
                <AppMargin>
                    <li class="center">
                        <h class="Search-Description">Create a Group</h>
                        <div className="border">
                            <input id="Create" type="text" onChange={this.updateGroup} />
                        </div>
                        <button className="createGroup" onClick={this.createGroup}>Create!</button>
                        <button className="deleteGroup" onClick={this.DeleteGroup}>[Delete Group]</button>

                    </li>

                    <li class="center">
                        <h class="Search-Description">Join a Group</h>
                        <div className="border">
                            <input id="join" type="text" onChange={this.updateGroup} />
                        </div>
                        <div className="columngap">
                            <button className="createGroup" onClick={this.joinGroup}>Join!</button>
                            <button className="deleteGroup" onClick={this.leaveGroup}>Leave Group</button>
                        </div>

                    </li>

                    <li class="center">
                        <h class="Search-Description">You have No Groups</h>
                    </li>

                </AppMargin>
            )
        }
    }

}
