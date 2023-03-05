import React, {useState,useEffect} from "react";
import "../styles/signup.scss";
import {isEqual,isEmail,isValidPassword} from "./functions/validations"
const SignUp = () => {
    const [signupForm,setSignUpForm] = useState({
        "username":"",
        "email":"",
        "password":"",
        "confirm_password":"",
    })
    const [hasError,setHasError] = useState(true)
    useEffect(()=>{
        if(isEqual(signupForm.password,signupForm.confirm_password) && isEmail(signupForm.email) && isValidPassword(signupForm.password)){
            setHasError(false)
        }else{
            setHasError(true)
        }
    },[signupForm])
    return(
        <div className="signup_container">
            <p>Create an account</p>
            <form className="form_container">
                <div className="input_container">
                    <label className="form_label">Username</label>
                    <input required value={signupForm.username}
                    onChange={(e)=>setSignUpForm({...signupForm,username:e.target.value})} placeholder="Enter your username" className="form_input" />
                </div>
                <div className="input_container">
                    <label className="form_label">Email</label>
                    <input required value={signupForm.email}
                    onChange={(e)=>setSignUpForm({...signupForm,email:e.target.value})} placeholder="Enter your email address" className="form_input" />
                    {!isEmail(signupForm.email) ? <span className="error_message">* Invalid email address.</span> :
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
    )
}

export default SignUp;