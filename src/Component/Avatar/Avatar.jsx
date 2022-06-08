import React from 'react'

export function getAvatar(id) {
    console.log("User: " + id)

    fetch(process.env.REACT_APP_API_PATH + "/user-artifacts?ownerID=" + id + "&type=avatar", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        },
    }).then(res => res.json())
        .then(
            result => {
                if (result[1] !== 0) {
                    console.log("URL: " +  result[0][0].url)
                    return result[0][0].url
                }
            },
            error => {
                this.setState({
                    error: error
                });
                console.log("Error loading user avatar: " + error)
            }
        );
}
