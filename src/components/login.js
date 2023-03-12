import React,{useState,useEffect} from "react";
import "../styles/signup.scss"
import axios from "axios";
import Modal from 'react-modal';

const Login = () => {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [loginForm,setLoginForm] = useState({
        username:"",
        password:""
    })
    const [formModal,setFormModal] = useState(false);
    const [successMes,setSuccessMes] = useState("");
    const [errMes,setErrMes] = useState("")
    useEffect(()=>{
        const authToken = localStorage.getItem("authKey");
        if(!authToken){
            setIsAuthenticated(false)
        }else{
            setIsAuthenticated(true)
        }
    },[])
    console.log(isAuthenticated)
    const onLogInUser = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/login",loginForm).then(res=>{
            localStorage.setItem("authKey",res.data.authToken);
            localStorage.setItem("currentUser",res.data.userId);
            setFormModal(true);
            setSuccessMes("You have successfully logged in.")
            setErrMes("")
        }).catch(err=>{
            setFormModal(true)
            setErrMes(err.response.data.error);
            setSuccessMes("");
        })
    }
    const customStyles = {
        content:{
            width:"25rem",height:"10rem",margin:"0 auto",textAlign:"center"
        }
    }
    return(
        <div>
        {isAuthenticated ?
            <div className="error_container">
                <p className="error_container_text">You are already logged in.</p>
                <div className="error_container_btn"><p className="error_container_btn_text">View profile</p></div>
            </div>
        :
            <div className="signup_container">
            <Modal isOpen={formModal} style={customStyles}>
                {successMes !== "" ? 
                <>
                <p className="successModalText">{successMes}</p> 
                <div onClick={()=>window.location.replace("/createroom")} className="modalBtn"><p className="modalBtnText">Create a voting room</p></div>
                </>
                : null}
                {errMes !== "" ? 
                <>
                <p className="errModalText">{errMes}</p> 
                <div onClick={()=>setFormModal(false)} className="modalBtn"><p className="modalBtnText">Try again</p></div>
                </>
                : null}
            </Modal>
            <p>Log In</p>
            <form onSubmit={(e)=>onLogInUser(e)} className="form_container">
                <div className="input_container">
                    <label className="form_label">Username</label>
                    <input onChange={(e)=>setLoginForm({...loginForm,username:e.target.value})}
                    placeholder="Enter your username" className="form_input" />
                </div>
                <div className="input_container">
                    <label className="form_label">Password</label>
                    <input onChange={(e)=>setLoginForm({...loginForm,password:e.target.value})} 
                    type="password" placeholder="Enter your password" className="form_input" />
                </div>
                <button className="btn-signup" type="submit">Login</button>
            </form>
            <p className="login_text">Don't have an account ?<a className="login_link" href="/signup"> Create one</a></p>
        </div>
        }
        </div>
    )
}

export default Login;