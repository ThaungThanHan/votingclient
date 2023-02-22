import React,{useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Default from "../assets/images/default_avatar.png"
import "../styles/createVotingRoom.scss";
import {FaPlus} from "react-icons/fa"
const CreateVotingRoom = () => {
    const [numberOptions,setNumberOptions] = useState([{id:0}]);
    const [image,setImage] = useState(null);
    const [options,setOptions] = useState({
        
    });
    const [hasOptions,setHasOptions] = useState(false);
    const [roomName,setRoomName] = useState("");
    const [roomDesc,setRoomDesc] = useState("");
    const [numVoters,setNumVoters] = useState(0);

    const [endDateTime,setEndDateTime] = useState();

    const handleAddOptions = () => {
        setNumberOptions(prevState=>[...prevState,{id:numberOptions[numberOptions.length-1].id+1}])
    }
    const handleRemoveOption = (id) => {
        const filteredRow = numberOptions.filter(element=> element.id !== id);
        setNumberOptions(filteredRow)
        delete options[id]
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
                "name":text
            }
        })
    }
    useEffect(()=>{
        if(options){
            if(Object.keys(options).length > 0 && options[0].name !== ""){
                setHasOptions(true)
            }else{
                setHasOptions(false)
            }
        }
    },[options])

    const handleCreateRoom = async() => {
        const roomId = uuidv4().slice(0,6);
        const participants = Object.values(options);
        const participantsData = [];
        participants.map(parti=>{
            participantsData.push({
                id:uuidv4().slice(0,6),
                name:parti.name,
                votes:0
            })
        })
        const createRoomData = {
            "_id":roomId,
            "roomName":roomName,
            "roomDesc":roomDesc,
            "endDateTime":endDateTime,
            "participants":participantsData,
            "num_participants":Object.keys(options).length,
            "num_voters":0,
            "voters_limit":numVoters,
            "winner":"",
        }
        await axios.post("http://localhost:5000/rooms",createRoomData).then(res=>console.log(res)).catch(err=>console.log(err));

    }   

    const onClickAvatarUpload = () => {
        document.getElementById("avatar_picker_id").click();
    }
    console.log("IMAGE " + image)
    return (
        <div className="roomcreation_container">
            <h2 className="roomcreation_header">Create your voting room</h2>
            <div className="room_form_container">
                <div className="room_name">
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
                <div className="room_name">
                    <div className="form_title">
                        {roomName == "" ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Voters limit</p>
                    </div>
                    <input type="number" onChange={(e)=>setNumVoters(e.target.value)} className="roomForm_input" />
                </div>
                <div className="room_description">
                    <div className="form_title">
                    {roomDesc == "" ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Voting end date</p>
                    </div>
                    <div className="form_datetime">
                        <DatePicker timeInputLabel="Time:" dateFormat="MM/dd/yyyy h:mm aa" placeholderText="Select due date and time"
                        showTimeInput className="form_date_picker" selected={endDateTime} onChange={date=>setEndDateTime(date)} />
                    </div>
                </div>
                <div className="room_description">
                    <div className="form_title">
                    {!hasOptions ? <span className="form_tick_before" /> : <span className="form_tick_after" /> }
                        <p>Add options</p>
                    </div>
                    {numberOptions.length > 0 && numberOptions.map((option)=>(
                    <div key={option.id} className="form_options">
                    <div onClick={()=>onClickAvatarUpload()} className="options_image">
                        <input onChange={(e)=>setImage(e.target.value)} accept="image/png, image/jpeg" name="avatar" id="avatar_picker_id" type="file" className="avatar_picker" />
                        <img src={Default} className="default_avatar" />
                    </div>
                    <div className="options_info">
                        <p>Name</p>
                        <input name={option.id} onChange={(e)=>handleOptionName(e)} className="options_input" />
                        {numberOptions.length > 1 ?<p onClick={()=>handleRemoveOption(option.id)} className="options_remove">Remove</p> : null}
                    </div>
                    </div>
                    ))}

                <div onClick={()=>handleAddOptions()} className="plus_options">
                    <FaPlus size={18} />
                </div>
                <div className="optionsForm_btnContainer">
                    <div onClick={()=>handleCreateRoom()} className="optionsForm_createBtn">
                        <p>Create room</p>
                    </div>
                </div>
                </div>
            </div> 
        </div>
    )
}

export default CreateVotingRoom;