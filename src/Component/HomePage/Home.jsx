import React from "react";
import "../../App.css";

import classes from './Home.css';


// pull in the images for the menu items
import SampleImage from "./Sample.png";
import heart from "../../assets/feather-icon/heart.svg";
import comment from "../../assets/feather-icon/comment.svg";
import bookmark from "../../assets/feather-icon/bookmark.svg";
import PostingList from "../PostingList.jsx";


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userid: props.userid
    };
  }

  render() {
    if (sessionStorage.getItem("user")) {
      return(
        <nav >
          <div>

            <p className ="home_Text">Home</p>
            
            <div className = "channel">
              <div className = "pink_back">
                <p className ="following_Text">Following</p>
                  <div className="audio_sneek_peek">
                   <img  id="Sample Cards" width="700" height="150"  src={SampleImage} alt="Sample Tiles" title="Sample"></img>

                  </div>
               </div>        
            </div>

            <div className = "recommend_channel">
              <div className = "pink_back">
                <p className ="following_Text">Recommend</p>
                  <div className="audio_sneek_peek">
                   <img  id="Sample Cards" width="700" height="150"  src={SampleImage} alt="Sample Tiles" title="Sample"></img>

                  </div>
               </div>        
            </div>
          
            <p className ="recent_posts">Recent Posts:</p>
            <div className = "post_card">
              <div className = "card"></div>        
               <span className ="eclipse"></span>
               <p className ="name_text">alan_hunt</p>
               <p className ="content_text">made some taps and clinks in davis hall... btw check me out on twitch!!! </p>
               <p className ="tags">Tags:   Davis   CS   Taps   Clinky   im-suffering</p>
               <img className= "heart" src={heart} ></img>
               <img className= "comment" src={comment} onClick={() => alert("Comment Box Clicked")} ></img>
               <img className= "bookmark" src={bookmark} ></img>
            </div>

            <div className = "feed">
              <PostingList  refresh={this.props.refresh} type="postlist" />
            </div>
          </div>

          
        </nav>
      );
    }
    else{
      return(
        <nav >
          <div>

            <p className ="home_Text">Home</p>
  
            <div className = "channel">
              <div className = "pink_back">
                <p className ="following_Text">Following</p>
                  <div className="audio_sneek_peek">
                  </div>
               </div>        
            </div>

            <div className = "recommend_channel">
              <div className = "pink_back">
                <p className ="following_Text">Recommend</p>
                  <div className="audio_sneek_peek">

                  </div>
               </div>        
            </div>
          
            <p className ="recent_posts">Recent Posts:</p>
          </div>

        </nav>
      
      );
    }
  }
}
export default Home;

