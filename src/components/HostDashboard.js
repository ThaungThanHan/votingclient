import React,{useEffect,useState} from 'react';
import Modal from 'react-modal';
import axios from "axios";
import "../styles/hostdashboard.scss";
import "../styles/signup.scss"

const HostDashboard = () => {
    const[isAuthenticated,setIsAuthenticated] = useState(false);
    const [roomsByHost,setRoomsByHost] = useState([])
    const [currentUser,setCurrentUser] = useState({});
    const [logoutModal,setLogoutModal] = useState(false);
    const onLogout = () => {
        localStorage.removeItem("authKey");
        localStorage.removeItem("currentUser");
        setLogoutModal(true);
    }
    useEffect(()=>{
        const authToken = localStorage.getItem("authKey");
        if(!authToken){
            setIsAuthenticated(false)
        }else{
            setIsAuthenticated(true)
        }
        axios.post(`http://localhost:5000/users/${localStorage.getItem('currentUser')}`).then(res=>{
            setCurrentUser(res.data)
        }).catch(err=>console.log(err))
    },[])
    useEffect(()=>{
        if(currentUser){
            axios.post(`http://localhost:5000/rooms/host`,{userId:currentUser._id},{
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem("authKey")}`
                }
            }).then(res=>{
                setRoomsByHost(res.data)
            }).catch(err=>console.log(err))
        }
    },[currentUser,roomsByHost])
    console.log(roomsByHost)
    const customStyles = {
        content:{
            width:"25rem",height:"10rem",margin:"0 auto",textAlign:"center"
        }
    }
    const deleteRoom = (roomId) => {
        const token = localStorage.getItem("authKey")
        axios.post(`http://localhost:5000/rooms/delete/${roomId}`,{
            headers:{Authorization:`Bearer ${token}`}
        }).then(res=>console.log(res)).catch(err=>console.log(err))
    }
    return(
        <div className="dashboard">
        {isAuthenticated ?
        <div className="dashboard_container">
        <div className="dahsboard_navbar">
            <p className="dashboard_username">
                Hello, {currentUser ? currentUser.username : null}
            </p>
            <p onClick={()=>onLogout()} className="dashboard_logout">
                Logout
            </p>
        </div>
        <div className="dashboard_sidebar">
            <div className="dashboard_item">   
                <p className="dashboard_item_text">All rooms</p>
            </div>
            <div className="dashboard_item">
                <p className="dashboard_item_text">Completed</p>
            </div>
            <div className="dashboard_item">
                <p className="dashboard_item_text">Deleted</p>
            </div>
        </div>
        <table className="dashboard_table">
                <tr className="dashboard_tableheader">
                    <th className="dashboard_tabletitle">Name</th>
                    <th className="dashboard_tabletitle">Voters</th>
                    <th className="dashboard_tabletitle">Deadline</th>
                    <th className="dashboard_tabletitle">Winner</th>
                    <th className="dashboard_tabletitle">Actions</th>
                </tr>
                {roomsByHost && roomsByHost.map(room=>(
                <tr key={room._id} className="dashboard_tablebody">
                    <td className="dashboard_tablecontent">{room.roomName}</td>
                    <td className="dashboard_tablecontent">{room.num_voters}/{room.voters_limit}</td>
                    <td className="dashboard_tablecontent">{room.endDateTime}</td>
                    <td className="dashboard_tablecontent">{room.winner ? room.winner : "-"}</td>
                    <td className="dashboard_tablecontent">
                        <div className="table_actions_container">
                            <div onClick={()=>window.location.replace(`http://localhost:3000/rooms/${room._id}`)} className="table_actions_btn">
                                <p className="table_actions_btn_text">View</p>
                            </div>
                            <div onClick={()=>deleteRoom(room._id)} className="table_actions_btn">
                                <p className="table_actions_btn_text">Delete</p>
                            </div>
                        </div>
                    </td>
                </tr>
                ))}

        </table>
    </div>
    :
    <div className="error_container">
    <p className="error_container_text">You are not logged in.</p>
    <div onClick={()=>window.location.replace('/login')} className="error_container_btn"><p className="error_container_btn_text">Log In</p></div>
    </div>
        }
        <Modal style={customStyles} isOpen={logoutModal}>
                <p className="successModalText">You are logged out.</p> 
                <div onClick={()=>window.location.replace("/")} className="modalBtn"><p className="modalBtnText">Home</p></div>
        </Modal>
        </div>
    )
}

export default HostDashboard;