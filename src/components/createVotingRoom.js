import React,{useEffect, useState} from "react";
import QRCode from 'qrcode'
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Default from "../assets/images/default_avatar.png"
import "../styles/createVotingRoom.scss";
import {FaPlus} from "react-icons/fa";
import Modal from 'react-modal';
import {isNotEmpty} from "./functions/validations";
import PulseLoader from "react-spinners/PulseLoader";


const CreateVotingRoom = () => {
    const dateNow = new Date();
    const [isLoading,setIsLoading] = useState(false);
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    const [hasError,setHasError] = useState(false);
    const [confirmModal,setConfirmModal] = useState(false);
    const [numberOptions,setNumberOptions] = useState([{id:0}]);
    const [image,setImage] = useState(null);
    const [qr,setQR] = useState("")
    const [options,setOptions] = useState({
        
    });
    const [hasOptions,setHasOptions] = useState(false);
    const [roomName,setRoomName] = useState("");
    const [roomDesc,setRoomDesc] = useState("");
    const [numVoters,setNumVoters] = useState(0);

    const [endDateTime,setEndDateTime] = useState("");

    const handleAddOptions = () => {
        setNumberOptions(prevState=>[...prevState,{id:numberOptions[numberOptions.length-1].id+1}])
    }
    const handleRemoveOption = (id) => {
        const filteredRow = numberOptions.filter(element=> element.id !== id);
        setNumberOptions(filteredRow)
        const optionCopy = {...options};
        delete optionCopy[id];
        setOptions(optionCopy);
    }
    
    const onNameChange = (e) => {
        setRoomName(e.target.value)
    }
    const onDescChange = (e) => {
        setRoomDesc(e.target.value)
    }
    const handleOptionName =(e,id) => {
        const text = e.target.value;
        setOptions({
            ...options,
            [e.target.name]:{
                ...options[`${id}`],
                "name":text
            }
        })
    }
    const handleOptionImage = (e,id) => {
        if(e.target.files.length > 0 && e.target.files[0]){
            const image = e.target.files[0];
            setOptions({
                ...options,
                [e.target.name]:{
                    ...options[`${id}`],
                    "image":image
                }
            })
        }
    }
    useEffect(()=>{
        if(localStorage.getItem("authKey") == ""){
            setIsAuthenticated(false)
        }else{
            setIsAuthenticated(true)
        }
    },[localStorage.getItem("authKey")])
    useEffect(()=>{
        if(isNotEmpty(roomName) && isNotEmpty(roomDesc) && hasOptions && numVoters > 0 && endDateTime !== "" && endDateTime > dateNow){
            setHasError(false)
        }else{
            setHasError(true)
        }
    },[roomName,roomDesc,numberOptions,numVoters,endDateTime,hasOptions])
    useEffect(()=>{
        console.log("OPTIONS " + Object.values(options).length)
        if(Object.values(options).length > 1){
            setHasOptions(true)
        }else{
            setHasOptions(false)
        }
        Object.values(options).forEach(opt=>{
            if(opt.name == ""){
                setHasOptions(false)
            }
        })
    },[options])
    console.log("Has " + hasOptions)
    const handleCreateRoom = async() => {
        setIsLoading(true);
        const roomId = uuidv4().slice(0,6);
        QRCode.toDataURL(`http://localhost:3000/rooms/${roomId}`)
        .then(url => {
        const participants = Object.values(options);
        const participantsData = [];
        const participantsImages = [];
        participants.map(parti=>{
            participantsData.push({
                id:uuidv4().slice(0,6),
                name:parti.name,
                votes:0
            })
            participantsImages.push(parti.image)
        })
        const currentUserId = localStorage.getItem("currentUser");
        const formData = new FormData();
        const createRoomData = {
            "_id":roomId,
            "roomName":roomName,
            "roomDesc":roomDesc,
            "roomQR":url,
            "currentUserId":currentUserId,
            "endDateTime":endDateTime,
            "participants":JSON.stringify(participantsData),
            "num_participants":Object.keys(options).length,
            "num_voters":0,
            "voters_limit":numVoters,
            "winner":"",
        }
        Object.entries(createRoomData).forEach(([key,value]) => {
            formData.append(key,value)
        })
        participantsImages.forEach(img=>{
            formData.append("files",img)
        })
        
        // for (var [key, value] of formData.entries()) {  //FORMDATA is not empty.
        //     console.log(key, value);
        // }
        const token = localStorage.getItem("authKey")
        axios.post("http://localhost:5000/rooms",formData,{
            headers:{"Content-Type": "multipart/form-data"}
        }).then(res=>{
            setIsLoading(false);
            window.location.replace(`http://localhost:3000/rooms/${roomId}`)
        }).catch(err=>console.log(err));
        })
        .catch(err => {
          console.error(err)
        });

    }   

    if(options){
        console.log(options)
    }

    const customStyles = {
        content:{
            width:"10rem",height:"6rem",margin:"0 auto",marginTop:"2rem",textAlign:"center"
        }
    }
    return (
        <div>
        <div>
        
        <Modal ariaHideApp={false} isOpen={confirmModal} style={customStyles}>
            <p style={{marginBottom:".5rem"}}>Are you sure you want to create room?</p>
            {!isLoading ?
            <div className="confirm_buttons_container">
                <div onClick={()=>setConfirmModal(false)} className="confirm_no">
                    <p>No</p>
                </div>
                <div onClick={()=>handleCreateRoom()} className="confirm_yes">
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
        <div className="roomcreation_container">
            <h2 className="roomcreation_header">Create your voting room</h2>
            <div className="room_form_container">
                <div className="room_description">
                    <div className="form_title">
                        {roomName == "" ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Name of the room</p>
                    </div>
                    <input onChange={(e)=>onNameChange(e)} className="roomForm_input" />
                </div>

                <div className="room_description">
                    <div className="form_title">
                    {roomDesc == "" ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Description of the room</p>
                    </div>
                    <textarea onChange={(e)=>onDescChange(e)} className="roomForm_input" />
                </div>
                <div className="room_description">
                    <div className="form_title">
                        {numVoters == "" || numVoters <= 0 ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Voters limit</p>
                    </div>
                    <input type="number" onChange={(e)=>setNumVoters(e.target.value)} className="roomForm_input" />
                </div>
                <div className="room_description">
                    <div className="form_title">
                    {endDateTime == "" || endDateTime < dateNow ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Voting end date</p>
                    </div>
                    <div className="form_datetime">
                        <DatePicker timeInputLabel="Time:" dateFormat="MM/dd/yyyy h:mm aa" placeholderText="Select due date and time"
                        minDate={dateNow} minTime={dateNow.getTime()} maxTime="2084506413113" showTimeSelect className="form_date_picker" selected={endDateTime} onChange={date=>setEndDateTime(date)} />
                    </div>
                </div>
                <div className="room_description">
                    <div className="form_title">
                    {!hasOptions ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Add options</p>
                    </div>
                    {numberOptions.length > 0 && numberOptions.map((option)=>(
                    <div key={option.id} className="form_options">
                    <div className="image_container">
                        {options && options[`${option.id}`] && options[`${option.id}`].image ?
                            <img className="default_avatar" src={URL.createObjectURL(options[`${option.id}`].image)} />
                        :
                            <img className="default_avatar" src={Default} />
                        }
                        <input onChange={(e)=>handleOptionImage(e,option.id)} accept="image/png, image/jpeg" name={option.id}
                        id="avatar_picker_id" type="file" className="avatar_picker" />
                    </div>
                    <div className="options_info">
                        <p>Name</p>
                        <input name={option.id} onChange={(e)=>handleOptionName(e,option.id)} className="options_input" />
                        {numberOptions.length > 1 ?<p onClick={()=>handleRemoveOption(option.id)} className="options_remove">Remove</p> : null}
                    </div>
                    </div>
                    ))}

                <div onClick={()=>handleAddOptions()} className="plus_options">
                    <FaPlus size={18} />
                </div>
                <div className="optionsForm_btnContainer">
                    <div onClick={!hasError ? ()=>setConfirmModal(true) : null}
                     className={hasError ? "optionsForm_createBtn_disabled" : "optionsForm_createBtn"}>
                        <p>Create room</p>
                    </div>
                </div>
                </div>
            </div> 
        </div>
        </div>
        </div>
    )
}

export default CreateVotingRoom;