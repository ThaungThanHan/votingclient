import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import "../styles/_homepage.scss";
import "../styles/App.scss";
const Homepage = () => {
    const [roomId,setRoomId] = useState("");
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    useEffect(()=>{
        if(localStorage.getItem("authKey") && localStorage.getItem("authKey") !== ""){
            setIsAuthenticated(true)
        }else{
            setIsAuthenticated(true)
        }
        console.log("AUTH " + isAuthenticated)
    },[localStorage.getItem("authKey")])
    return (
        <div className="homepageContainer">
                <h1 className="homepageEntry_logo">Voting App</h1>
                <input onChange={(e)=>setRoomId(e.target.value)} className="homepage_Search" placeholder="Enter voting room ID" />
                <Link style={{textDecoration:"none"}} 
                    to={roomId !== "" ?  `/rooms/${roomId}` : null}>
                <div className="Search_btn">
                    <p className="Search_btn_text">ENTER</p>
                </div></Link>
                <Link style={{textDecoration:"none"}} 
                to={isAuthenticated ? "/createroom" : "/login"}>
                    <div className="Search_btn">
                        <p className="Search_btn_text">CREATE A VOTING ROOM</p>
                    </div>
                </Link>

        </div>
    )
}

export default Homepage;