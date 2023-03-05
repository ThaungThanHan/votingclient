import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../styles/_homepage.scss";
import "../styles/App.scss";
const Homepage = () => {
    const [roomId,setRoomId] = useState("");

    return (
        <div className="homepageContainer">
                <h1 className="homepageEntry_logo">Voting App</h1>
                <input onChange={(e)=>setRoomId(e.target.value)} className="homepage_Search" placeholder="Enter voting room ID" />
                <Link style={{textDecoration:"none"}} 
                    to={roomId !== "" ?  `/rooms/${roomId}` : null}>
                <div className="Search_btn">
                    <p className="Search_btn_text">ENTER</p>
                </div></Link>
                <Link style={{textDecoration:"none"}} to="/signup">
                    <div className="Search_btn">
                        <p className="Search_btn_text">CREATE A VOTING ROOM</p>
                    </div>
                </Link>

        </div>
    )
}

export default Homepage;