import React, {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {AiOutlineCheck, AiFillCrown,AiOutlineInfo,AiFillCloseCircle} from "react-icons/ai"
import Modal from 'react-modal';

import "../styles/VotingRoom.scss"
const VotingRoom = (props) => {
    const [authenticated,setIsAuthenticated] = useState(false);
    const [optionsModal,setOptionsModal] = useState(false);
    const {id} = useParams()
    const [roomData,setRoomData] = useState({});
    const [selectedOptionData,setSelectedOptionData] = useState({});
    const [remainingTime,setRemainingTime] = useState({
        "day":0,
        "hour":0,
        "minute":0,
        "second":0
    });
    const dateNow = Date.now();
    useEffect(()=>{
        const authkey = localStorage.getItem("authKey");
        if(authkey){
            setIsAuthenticated(true)
        }else{
            setIsAuthenticated(false)
        }
        axios.get(`http://localhost:5000/rooms/${id}`).then(res=>{
            setRoomData(res.data)
        }).catch(err=>{
            console.error(err)
        })
    },[roomData]);
    useEffect(()=>{
        const currentTime = new Date(); //"March 14 2023 21:00:00"
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const enddatetime = new Date(roomData.endDateTime)
        const roomEndTime = new Date(`${monthNames[enddatetime.getMonth()]} ${enddatetime.getDate()} ${enddatetime.getFullYear()} ${enddatetime.getHours()}:${enddatetime.getMinutes()}:${enddatetime.getSeconds()}`)

        const timeDiff = roomEndTime - currentTime
        const remainDay = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
        const remainHours = Math.floor((timeDiff / 1000 / 60 / 60)) % 24;
        const remainMinutes = Math.floor((timeDiff / 1000 / 60 ))% 60
        const remainSeconds = Math.floor((timeDiff / 1000 )) % 60;

        if(remainDay <= 0 && remainHours <= 0 && remainMinutes <= 0 && remainSeconds <= 0){
            return setRemainingTime({day:0,hour:0,minute:0,second:0})
        }else{
            return setRemainingTime({day:remainDay,hour:remainHours,minute:remainMinutes,second:remainSeconds})
        }
    },[dateNow])

    const {roomName,roomDesc,participants,num_voters,winner} = roomData;
    const selectOption = (option) => {
        setSelectedOptionData(option)
    }
    const onVoteOption = () => {
        const optionData = {
            "id":selectedOptionData.id,
            "votes":selectedOptionData.votes,
            "num_voters":num_voters
        }
        axios.patch(`http://localhost:5000/rooms/${id}`,optionData).then(res=>{
            console.log(`you have voted for ${selectedOptionData.name}`);
            window.location.reload();
        }).catch(err=>console.error(err))
    }
    const customStyles = {
        content:{
            width:"15rem",height:"20rem",margin:"0 auto",marginTop:"2rem"
        }
    }
    const handleDeleteRoom = (id) => {
        axios.post(`http://localhost:5000/rooms/delete/${id}`,null,{headers:{   // 401 if not null put in in body or "," after headers object.
            "Authorization":`Bearer ${localStorage.getItem("authKey")}`
        }},).then(res=>{
            window.location.replace(`http://localhost:3000/dashboard/${localStorage.getItem("currentUser")}`);
        }).catch(err=>{
            console.error(err);
        })
    }
    return (
        <>
        <Modal isOpen={optionsModal} style={customStyles}>
            <AiFillCloseCircle onClick={()=>setOptionsModal(false)} className="modal_close_btn" />
            <div className="qr_container">
                <div className="QR">
                    <img src={roomData.roomQR} style={{width:"100%",height:"100%"}}/>
                </div>
            </div>
            <div className="admin_container">
                <div className="host_container">
                    <p>Host:</p>
                    <p>{roomData.host}</p>
                </div>
                <div className="host_container">
                    <p>Voting Limit:</p>
                    <p>{roomData.voters_limit}</p>
                </div>
            </div>
            {authenticated ? <div onClick={()=>handleDeleteRoom(roomData._id)} className="admin_delete">
                <p className="admin_delete_text">Delete</p>
            </div> : null}
            <div>
            </div>
        </Modal>
        <div className="room_container">
            <div onClick={()=>setOptionsModal(true)} style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                <p className="room_name">{roomName}</p>
                <div className="room_info_container"><AiOutlineInfo /></div>
            </div>
            <p className="room_desc">{roomDesc}</p>
            {winner ?
            <div>
              <h2 className="winner_text">The Winner</h2>
              <div className="winner_container">
                <AiFillCrown className="crown_icon" size={100} color="gold"/>
                <div className="winner_image">
                    <img style={{width:"100%",height:"100%"}} src={winner.avatar} />
                </div>    
                <div className="winner_name">
                    <p>{winner.name}</p>
                </div>
              </div>
            </div>
            :
            <div>
            <div className="room_limit_container">
            <p className="room_time_limit">
                Time duration: {`${remainingTime.day}d:${remainingTime.hour}hr:${remainingTime.minute}m:${remainingTime.second}s`}
            </p>
            <p className={roomData.num_voters !== roomData.voters_limit ? "room_voter_limit_before" : "room_voter_limit_after"}>
                {`Voters: ${roomData.num_voters}/${roomData.voters_limit}`}
            </p>
        </div>
        <div className="room_options">
            {participants && participants.map(option=>(
                <div className={selectedOptionData.id == option.id && !authenticated ? "option_container_after" : "option_container_before" }
                key={option.id}>
                    <div className="option_image">
                        <img className="option_avatar" src={option.avatar}/>
                    </div>
                    <p 
                    className={selectedOptionData.id == option.id ? "option_name_after" : "option_name_before"}>{option.name}</p>
                    <div onClick={!authenticated ? ()=>selectOption(option) : null} 
                    className={selectedOptionData.id == option.id ? "tick_container_after" : "tick_container_before" }>
                        <AiOutlineCheck color={selectedOptionData.id == option.id ? "white" : "black"} size={25} />
                    </div>
                </div>
            ))}
            </div>
            <div onClick={roomData.num_voters !== roomData.voters_limit && !authenticated ? ()=>onVoteOption() : null} 
            className={(roomData.num_voters !== roomData.voters_limit) && !authenticated ? "voting_btn" : "voting_btn_disabled"}>
                <p className="voting_btn_text">Vote!</p>
            </div>
            </div>
        }
        </div>
        </>
    )   
}

export default VotingRoom;