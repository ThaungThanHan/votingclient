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
    const onLogInUser = (e) => {
        e.preventDefault();
        axios.post(`${HOST}/login`,loginForm,{
            "headers":{
                'Content-Type': 'application/json',
            }
        }).then(res=>{
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
        <>
            <Modal isOpen={isAuthenticated} style={customStyles}>
                <p className="successModalText">You have successfully logged in.</p> 
                <div className="modalbtn_container">
                    <div onClick={()=>window.location.replace("/createroom")} className="modalBtn"><p className="modalBtnText">Create a voting room</p></div>
                    <div onClick={()=>window.location.replace(`/dashboard/${localStorage.getItem("currentUser")}`)} className="modalBtn">
                        <p className="modalBtnText">View dashboard</p>
                    </div>
                </div>
            </Modal>
        </>
        :
            <div className="signup_container">
            <Modal isOpen={formModal} style={customStyles}>
                {successMes !== "" ? 
                <>
                <p className="successModalText">{successMes}</p> 
                <div className="modalbtn_container">
                    <div onClick={()=>window.location.replace("/createroom")} className="modalBtn"><p className="modalBtnText">Create a voting room</p></div>
                    <div onClick={()=>window.location.replace(`/dashboard/${localStorage.getItem("currentUser")}`)} className="modalBtn">
                        <p className="modalBtnText">View dashboard</p>
                    </div>
                </div>
                </>
                : null}
                {errMes !== "" ? 
                <>
                <p className="errModalText">{errMes}</p> 
                <div onClick={()=>setFormModal(false)} className="modalBtn"><p className="modalBtnText">Try again</p></div>
                </>
                : null}
            </Modal>
            <p className="login_title">LOGIN</p>
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