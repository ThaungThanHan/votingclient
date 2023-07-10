import React, {useState,useEffect} from "react";
import Modal from 'react-modal';
import axios from "axios"
import "../styles/signup.scss";
import {isEqual,isEmail,isValidPassword} from "./functions/validations";
import { v4 as uuidv4 } from 'uuid';

const SignUp = () => {
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
    },[localStorage.getItem("authKey")])
    const [signupForm,setSignUpForm] = useState({
        "username":"",
        "email":"",
        "password":"",
        "confirm_password":"",
    })
    const [formModal,setFormModal] = useState(false);
    const [successMes,setSuccessMes] = useState("");
    const [errMes,setErrMes] = useState("")
    const [hasError,setHasError] = useState(true)
    useEffect(()=>{
        if(isEqual(signupForm.password,signupForm.confirm_password) && isEmail(signupForm.email) && isValidPassword(signupForm.password)){
            setHasError(false)
        }else{
            setHasError(true)
        }
    },[signupForm])
    const onSubmitSignUp = (e) => {
        e.preventDefault();
        const formData = {
            "userId":uuidv4().slice(0,6),
            "username":signupForm.username,
            "email":signupForm.email,
            "password":signupForm.password,
        }
        axios.post(`${HOST}/signup`,formData).then(res=>{
            setFormModal(true)
            setSuccessMes(res.data)
            setErrMes("")
        }).catch(err=>{setFormModal(true);setErrMes(err.response.data.error);setSuccessMes("")})
        return false;
    }
    const customStyles = {
        content:{
            width:"25rem",height:"10rem",margin:"0 auto",textAlign:"center"
        }
    }
    return(
        <div>
        {isAuthenticated ?
            <Modal isOpen={isAuthenticated} style={customStyles}>
            <p className="successModalText">You have successfully logged in.</p> 
            <div className="modalbtn_container">
                <div onClick={()=>window.location.replace("/createroom")} className="modalBtn"><p className="modalBtnText">Create a voting room</p></div>
                <div onClick={()=>window.location.replace(`/dashboard/${localStorage.getItem("currentUser")}`)} className="modalBtn">
                    <p className="modalBtnText">View dashboard</p>
                </div>
            </div>
            </Modal>   
        :
        <div className="signup_container">
            <p className="login_title">Create an account</p>
            <form onSubmit={(e)=>onSubmitSignUp(e)} className="form_container">
                <Modal isOpen={formModal} style={customStyles}>
                    {successMes !== "" ? 
                    <>
                    <p className="successModalText">{successMes}</p> 
                    <div onClick={()=>window.location.replace("/login")} className="modalBtn"><p className="modalBtnText">Login now</p></div>

                    </>
                     : null}
                    {errMes !== "" ? 
                    <>
                    <p className="errModalText">{errMes}</p> 
                    <div onClick={()=>setFormModal(false)} className="modalBtn"><p className="modalBtnText">Resume registration</p></div>
                    </>
                    : null}
                </Modal>
                <div className="input_container">
                    <label className="form_label">Username</label>
                    <input required value={signupForm.username}
                    onChange={(e)=>setSignUpForm({...signupForm,username:e.target.value})} placeholder="Enter your username" className="form_input" />
                </div>
                <div className="input_container">
                    <label className="form_label">Email</label>
                    <input required value={signupForm.email}
                    onChange={(e)=>setSignUpForm({...signupForm,email:e.target.value})} placeholder="Enter your email address" className="form_input" />
                    {!isEmail(signupForm.email) ? <span className="error_message">* Please enter correct email address.</span> :
                    null}
                </div>
                <div className="input_container">
                    <label className="form_label">Password</label>
                    <input required value={signupForm.password} onChange={(e)=>setSignUpForm({...signupForm,password:e.target.value})}
                    type="password" placeholder="Enter your password" className="form_input" />
                    {!isValidPassword(signupForm.password) ? <span className="error_message">* Password must be at least 8 characters.</span> :
                    null}
                </div>
                <div className="input_container">
                    <label className="form_label">Confirm Password</label>
                    <input required value={signupForm.confirm_password} onChange={(e)=>setSignUpForm({...signupForm,confirm_password:e.target.value})}
                    type="password" placeholder="Enter your password above" className="form_input" />
                    {!isEqual(signupForm.password,signupForm.confirm_password) ? <span className="error_message">* Passwords do not match.</span> :
                    null}
                </div>
                {hasError ?
                    <button disabled className="btnerror-signup" type="submit">Sign up</button>
                    :
                    <button className="btn-signup" type="submit">Sign up</button>
                }
            </form>
            <p className="login_text">Do you already have an account? <a className="login_link" href="/login">Log in</a></p>
        </div>
        }
        </div>
    )
}

export default SignUp;