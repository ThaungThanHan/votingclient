import React from "react";
import "../styles/signup.scss"
const Login = () => {
    return(
        <div className="signup_container">
            <p>Create an account</p>
            <form className="form_container">
                <div className="input_container">
                    <label className="form_label">Username</label>
                    <input placeholder="Enter your username" className="form_input" />
                </div>
                <div className="input_container">
                    <label className="form_label">Password</label>
                    <input type="password" placeholder="Enter your password" className="form_input" />
                </div>
                <button className="btn-signup" type="submit">Login</button>
            </form>
            <p className="login_text">Don't have an account ?<a className="login_link" href="/signup"> Create one</a></p>
        </div>
    )
}

export default Login;