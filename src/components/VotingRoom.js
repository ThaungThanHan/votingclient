import React, {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {AiOutlineCheck, AiFillCrown,
    AiFillLock, AiOutlineInfo,AiFillCloseCircle,AiOutlineUserAdd} from "react-icons/ai"
import Modal from 'react-modal';
import PulseLoader from "react-spinners/PulseLoader";
import {isEmail} from "./functions/validations";

//components
import CodeInput from "./VotingRoom/CodeInput"; 

import "../styles/VotingRoom.scss"
const VotingRoom = (props) =>{
    const HOST = process.env.REACT_APP_hostname
    const [validVoter,setValidVoter] = useState(false);
    const [accessCode,setAccessCode] = useState("");
    const [isCodeValid,setIsCodeValid] = useState();
    const [isFullVoters,setIsFullVoters] = useState();

    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [optionsModal,setOptionsModal] = useState(false);
    const [inviteModal,setInviteModal] = useState(false);
    const [inviteNav,setInviteNav] = useState("INVITE")
    const [confirmModal,setConfirmModal] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [clipBoardText,setClipBoardText] = useState("Copy link to clipboard");
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
    const [emailList,setEmailList] = useState([]);
    const [onChangeEmail,setOnChangeEmail] = useState("");
    const [hasEmailError,setHasEmailError] = useState(true);
    const [hostInfo,setHostInfo] = useState(null);

    useEffect(()=>{
        if(isEmail(onChangeEmail)){
            setHasEmailError(false)
        }else{
            setHasEmailError(true)
        }
    },[onChangeEmail])

    useEffect(()=>{
        const userToken = localStorage.getItem("authKey");
        if(userToken){
            axios.get(`${HOST}/verifyUser`,{
                headers:{Authorization:`Bearer ${userToken}`}
            }).then(res=>setIsAuthenticated(true)).catch(err=>setIsAuthenticated(false));
        }else{
            setIsAuthenticated(false);
        }
        axios.get(`${HOST}/rooms/${id}`).then(res=>{
            setRoomData(res.data)
        }).catch(err=>{
            console.error(err)
        })
        if(localStorage.getItem("currentUser") == roomData.host){
            setIsAdmin(true)
        }else{
            setIsAdmin(false)
        }
        axios.get(`${HOST}/users/${roomData.host}`).then(res=>{
            console.log(res.data)
            setHostInfo(res.data);
        }).catch(err=>console.log(err))
    },[localStorage.getItem("authKey"),roomData]);
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

    useEffect(()=>{
        if(roomData.votersList && roomData.votersList.length == roomData.voters_limit){
            setIsFullVoters(true)
        }else{
            setIsFullVoters(false);
        }
    },[roomData])

    const {roomName,roomDesc,participants,num_voters,winner} = roomData;
    const selectOption = (option) => {
        setSelectedOptionData(option)
    }
    const onVoteOption = () => {
        setIsLoading(true);
        const optionData = {
            "id":selectedOptionData.id,
            "votes":selectedOptionData.votes,
            "num_voters":num_voters,
            "token":validVoter.token
        }
        axios.patch(`${HOST}/rooms/${id}`,optionData).then(res=>{
            console.log(`you have voted for ${selectedOptionData.name}`);
            window.location.reload();
            setIsLoading(false);
        }).catch(err=>{setIsLoading(false);console.error(err)})
    }
    const customStyles = {
        content:{
            width:"15rem",height:"20rem",margin:"0 auto",marginTop:"2rem"
        }
    }
    const InviteModalcustomStyles = {
        content:{
            width:"20rem",height:"25rem",margin:"0 auto",marginTop:"2rem"
        }
    }
    const confirmModalStyles = {
        content:{
            width:"10rem",height:"6rem",margin:"0 auto",marginTop:"2rem",textAlign:"center"
        }
    }
    const handleDeleteRoom = (id) => {
        axios.post(`${HOST}/rooms/delete/${id}`,null,{headers:{   // 401 if not null put in in body or "," after headers object.
            "Authorization":`Bearer ${localStorage.getItem("authKey")}`
        }},).then(res=>{
            window.location.replace(`${process.env.REACT_APP_domain}dashboard/${localStorage.getItem("currentUser")}`);
        }).catch(err=>{
            console.error(err);
        })
    }
    const onClickClipboard = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_domain}rooms/${roomData._id}`);
        setClipBoardText("Link Copied!")
    }
    const onSendInvite = () => [
        axios.post(`${HOST}/rooms/createVoters`,{id:roomData._id,emailList:emailList},{
            headers:{"Content-Type":"application/json"}
        }).then(res=>{
            setInviteNav("VOTERS");
            setEmailList([]);
        }).catch(err=>{
            console.error(err)
        })
    ]
    const removeAddedVoter = (index) => {
        const newArray = emailList;
        newArray.splice(index,1);
        console.log("ENWWW " + newArray)
        setEmailList(newArray);
    }
    const handleSubmitAccessCode = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const accessCodeData = {
            "id":roomData._id,
            "accessCode":accessCode
        }
        axios.post(`${HOST}/rooms/verifyAccessCode`,accessCodeData,{
            headers:{"Content-Type":`application/json`}
        }).then(res=>{
            setIsCodeValid(true);
            setValidVoter(res.data);
            setIsLoading(false);
        }).catch(err=>{
            setIsLoading(false);
            setIsCodeValid(false);
        })
    }
    const removeVoterFromList = (voterEmail) => {
        const removeVoterInfo = {
            id:roomData._id,
            email:voterEmail
        }
        axios.post(`${HOST}/rooms/removeVoterFromList`,removeVoterInfo,{
            headers:{"Content-Type":`application/json`}
        }).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <>
        {/* // Invite_MODAL */}
        <Modal isOpen={inviteModal} style={InviteModalcustomStyles}>
            <AiFillCloseCircle 
            onClick={()=>{setInviteModal(false)}}
             className="modal_close_btn" />
            {/* NAV */}
            <div className="inviteModal_nav">
                <div onClick={()=>setInviteNav("INVITE")} className="inviteModal_nav_button">
                    <p className={inviteNav == "INVITE" ? "inviteModal_nav_textSelected" : "inviteModal_nav_text"}>
                    Invite</p>
                </div>
                <div onClick={()=>setInviteNav("VOTERS")} className="inviteModal_nav_button">
                    <p 
                    className={inviteNav == "VOTERS" ? "inviteModal_nav_textSelected" : "inviteModal_nav_text"}>Voters</p>
                </div>
            </div>
            {/* INVITE */}
            {inviteNav == "INVITE" ?
            <div className="inviteModal_container">
                <p className="inviteModal_title">
                    Enter email address to send invite
                </p>
                {/* MODAL FORM */}
                <form onSubmit={(e)=>{e.preventDefault();setEmailList([...emailList,onChangeEmail]);setOnChangeEmail("")}}
                className="inviteModal_form">
                <input required value={onChangeEmail} type="email"
                    onChange={(e)=>setOnChangeEmail(e.target.value)} 
                    placeholder="Enter your email address" className="form_input" />
                    <button disabled={hasEmailError ? true : false}
                    className="inviteModal_form_button">
                        <p>Add</p>
                    </button>
                </form>
                {/* INVITED LIST */}
                <div className="invitedList">
                    <p className="inviteModal_title">
                        Email list
                    </p>
                    <div className="invited_container">
                    {emailList ?
                        emailList.map((email,index)=>
                            <div className="invited_mail">
                                <p className="invited_mail_text">
                                    {email}
                                </p>
                                <AiFillCloseCircle onClick={()=>removeAddedVoter(index)}
                                className="invited_mail_icon" size={25} />
                            </div>
                            )
                            : <p>no mail</p>
                    }
                    </div>
                    {isFullVoters ? 
                    <div className="voting_btn_disabled">
                    <span className="voting_btn_warning">Voters limit exceeded.</span>
                    </div> 
                    :
                    <div onClick={()=>onSendInvite()} 
                    className="inviteModal_send_button"
                    >
                            <p>Send invite</p>
                    </div>}
                </div>
            </div> :
                    <div className="voters_container">
                    {roomData.votersList ?
                        roomData.votersList.map(voter=>
                            <div className="invited_mail">
                                <p className="invited_mail_text">
                                    {voter.email}
                                </p>
                                <p className="invited_mail_status">
                                    {voter.voteStatus ?
                                     <p className="invited_mail_voted">Voted</p>: 
                                     <p className="invited_mail_available">Available</p>}
                                </p>
                                <AiFillCloseCircle 
                                onClick={!voter.voterStatus ? ()=>removeVoterFromList(voter.email) : null}
                                className={!voter.voteStatus ? "invited_mail_icon" : "invited_mail_icon_disabled"}
                                size={25} />
                            </div>
                            )
                            : <p>no mail</p>
                    }
                    </div>
            }

        </Modal>

        {/* // Room_INFO */}
        <Modal isOpen={optionsModal} style={customStyles}>
            <AiFillCloseCircle 
            onClick={()=>{setOptionsModal(false);setClipBoardText("Copy link to clipboard")}} className="modal_close_btn" />
            <div className="qr_container">
                <div className="QR">
                    <img src={roomData.roomQR} style={{width:"100%",height:"100%"}}/>
                </div>
                <div onClick={()=>onClickClipboard()} 
                className="clipboard_container">
                    <p>{clipBoardText}</p>
                </div>
            </div>
            <div className="admin_container">
                <div className="host_container">
                    <p>Host:</p>
                    <p>{hostInfo && hostInfo.username}</p>
                </div>
                <div className="host_container">
                    <p>Voting Limit:</p>
                    <p>{roomData.voters_limit}</p>
                </div>
            </div>
            {isAdmin ? <div onClick={()=>handleDeleteRoom(roomData._id)} className="admin_delete">
                <p className="admin_delete_text">Delete</p>
            </div> : null}
            <div>
            </div>
        </Modal>
        <Modal ariaHideApp={false} isOpen={confirmModal} style={confirmModalStyles}>
            <p style={{marginBottom:".5rem"}}>Are you sure you want to vote {selectedOptionData.name} ?</p>
            {!isLoading ?
            <div className="confirm_buttons_container">
                <div onClick={()=>setConfirmModal(false)} className="confirm_no">
                    <p>No</p>
                </div>
                <div onClick={()=>onVoteOption()} className="confirm_yes">
                    <p>Yes</p>
                </div>
            </div> :
            <PulseLoader
            color="#1ab252"
            loading={isLoading}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
            />
            }
        </Modal>

        {/* Voting Room Body */}
        { validVoter || isAdmin ? 
        <div className="room_container">
            <div style={{width:"20rem",
            display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                {isAdmin ?
                    <div onClick={()=>setInviteModal(true)} className="room_invite"><AiOutlineUserAdd /></div>
                : <div style={{width:"2rem"}}></div> }
                <p className="room_name">{roomName}</p>
                <div onClick={()=>setOptionsModal(true)} className="room_info_container"><AiOutlineInfo /></div>
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
                <div className={selectedOptionData.id == option.id && !isAdmin ? "option_container_after" : "option_container_before" }
                key={option.id}>
                    <div className="option_image">
                        <img className="option_avatar" src={option.avatar}/>
                    </div>
                    <p 
                    className={selectedOptionData.id == option.id ? "option_name_after" : "option_name_before"}>{option.name}</p>
                    <div onClick={!isAdmin ? ()=>selectOption(option) : null} 
                    className={selectedOptionData.id == option.id ? "tick_container_after" : "tick_container_before" }>
                        <AiOutlineCheck color={selectedOptionData.id == option.id ? "white" : "black"} size={25} />
                    </div>
                </div>
            ))}
            </div>
            <div onClick={roomData.num_voters !== roomData.voters_limit && !isAdmin && !validVoter.voteStatus
             ? ()=>setConfirmModal(true) : null} 
            className={(roomData.num_voters !== roomData.voters_limit) && !isAdmin
            && !validVoter.voteStatus ? "voting_btn" : "voting_btn_disabled"}>
                {isAdmin ? 
                    <span className="voting_btn_warning">You cannot vote as host.</span>
                :
                roomData.num_voters !== roomData.voters_limit ?<div>
                {validVoter && !validVoter.voteStatus ? 
                <p className="voting_btn_text">Vote!</p> :
                <span className="voting_btn_warning">You have already voted once.</span>
                }</div> :<span className="voting_btn_warning">Voting limit exceeded</span>
            }
            </div>
            </div>
        }
        </div> :
            <div className="room_container">
                <div className="codeInput_container">
                    <h1>{roomData.roomName}</h1>
                    <h2>by {hostInfo && hostInfo.username}</h2>
                    {/* <AiFillLock size={70}/> */}
                    <p className="codeInput_title">Please enter access code</p>
                    {!isLoading ?
                    <form onSubmit={(e)=>handleSubmitAccessCode(e)} className="codeInput_form">
                        <input value={accessCode} onChange={(e)=>setAccessCode(e.target.value)} 
                        className="codeInput_input" placeholder="Enter access code"/>
                        {isCodeValid == true ? <span className="codeInput_correct">Access granted</span> : 
                        isCodeValid == false ? 
                        <span className="codeInput_incorrect">Access code invalid</span> : null}
                        <button type="submit" className="codeInput_button">
                            <p className="voting_btn_text">Enter</p>
                        </button>
                    </form> :
                    <PulseLoader
                    color="#1ab252"
                    loading={isLoading}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    />
                    }
                </div>
            </div>
        }
        </>
    )   
}

export default VotingRoom;