import React from 'react'

// NOTE: this is a bunch of pre-built functions that update privacy to save time <3

// get the preference - "public" or "private"
// returns promise - use .then(preference => logic) to extract preference
export function getPrivacyMode () {
   // provides id, name, value (name = privacy_mode)
  return fetch(process.env.REACT_APP_API_PATH + "/user-preferences?userID=" + sessionStorage.getItem("user"), {
    method: "get",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
  }).then(res => res.json())
    .then(
      result => {
        let output = {};
        result[0].forEach(function (pref) {
          if (pref.name === "privacy_mode") {
            output = pref;
            console.log(output);
          }
         });
         return output;
      });
}

// update the preference
//pref should either be "public" or "private"
export function updatePrivacyMode(prefId, pref) {
  let url = process.env.REACT_APP_API_PATH + "/user-preferences/" + prefId;
  fetch(url, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    },
    body: JSON.stringify({
      'userID': sessionStorage.getItem("user"),
      name: "privacy_mode",
      value: pref,
    })
  }).then(response => response.json())
    .then(data => {
      // after updating user preference, update all posts tied to the user

      // 1 first get the user's posts in order to access all post ids

      let url = process.env.REACT_APP_API_PATH + "/post-tags?userID=" + sessionStorage.getItem("user");
      fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
      }).then(response => response.json())
        .then(data => {
          const postTags = data[0];
          // 2 now update each post's privacy_mode tag
          for (let i = 0; i < postTags.length ; i ++) {
            const postInfo = postTags[i];
            updatePostPrivacy(postInfo, pref);
          }
        });


    });
}

// CREATE a privacy tag for a post
// preference should be either "public" or "private"
export function createPostPrivacy(postId, preference) {
  fetch(process.env.REACT_APP_API_PATH + "/post-tags", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
          "postID": postId,
          "userID": sessionStorage.getItem("user"),
          "name": "privacy_mode",
          "type": preference
      })
  }).then(res => res.json())
    .then(result => {
            //console.log("Applied Tag")
            //console.log(result);
    });
}

// UPDATE a privacy tag for a post
// preference should be either "public" or "private"
export function updatePostPrivacy(postInfo, preference) {
  const postTagId = postInfo.id;
  const postId = postInfo.post.id;
    // 1 first find the privacy_mode posttag associated with post id
  const url = process.env.REACT_APP_API_PATH + "/post-tags/" + postTagId;
  fetch(url, {
      method: "PATCH",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
          "postID": postId,
          "userID": sessionStorage.getItem("user"),
          "name": "privacy_mode",
          "type": preference
      })
  }).then(res => res.json())
    .then(result => {
            //console.log("Updated Tag")
            //console.log(result);
            //getUserPostTags().then(result=>console.log(result)); // this is used to test if it updated properly
    });
}

// get all privacy post tags tied to this user
function getUserPostTags() {
  let url = process.env.REACT_APP_API_PATH + "/post-tags?userID=" + sessionStorage.getItem("user");
  return fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem("token")
    }
  }).then(response => response.json())
    .then(data => {
      const postTags = data[0];
      return postTags;
    });
}
