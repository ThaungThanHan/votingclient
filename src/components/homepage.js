import React, {useState,useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import "../styles/_homepage.scss";
import "../styles/App.scss";
import LOGO from "../assets/images/votingapp_logo.png"

const Homepage = () => {
    const [roomId,setRoomId] = useState("");
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const HOST = process.env.REACT_APP_hostname;
    useEffect(()=>{
        const userToken = localStorage.getItem("authKey");
        if(userToken){
            axios.get(`${HOST}/verifyUser`,{
                headers:{Authorization:`Bearer ${userToken}`}
            }).then(res=>setIsAuthenticated(true)).catch(err=>setIsAuthenticated(false));
        }else{
            setIsAuthenticated(false);
        }
        console.log("AUTH " + isAuthenticated)
    },[localStorage.getItem("authKey")])
    return (
        <div className="homepageContainer">
                {/* <h1 className="homepageEntry_logo">Voting App</h1> */}
                <div className="logo_container">
                    <img style={{width:"100%",height:"100%"}} src={LOGO} />
                </div>
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