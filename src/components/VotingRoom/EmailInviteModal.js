import React,{useState,useEffect} from "react";
import {isEmail} from "./functions/validations";
import Modal from 'react-modal';

const EmailInviteModal = () => {
    useEffect(()=>{
        if(isEmail(onChangeEmail)){
            setHasEmailError(false)
        }else{
            setHasEmailError(true)
        }
    },[onChangeEmail]);
    return (
            {/* // Invite_MODAL */}
            <Modal isOpen={inviteModal} style={InviteModalcustomStyles}>
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
                        emailList.map(email=>
                            <div className="invited_mail">
                                <p className="invited_mail_text">
                                    {email}
                                </p>
                                <AiFillCloseCircle className="invited_mail_icon" size={25} />
                            </div>
                            )
                            : <p>no mail</p>
                    }
                    </div>
                    <div onClick={()=>onSendInvite()} className="inviteModal_send_button">
                            <p>Send invite</p>
                    </div>
                </div>
            </div>
        </Modal>
    )


}