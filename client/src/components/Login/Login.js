import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useHistory } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import userContext from '../../context/userContext';
import ErrorNotice from '../../misc/ErrorNotice';
import axios from 'axios';
import url from '../../misc/url'

const Login = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const {setUserData} = useContext(userContext);

    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try{
        const loginUser = {email, password};
        const loginResponse = await axios.post(`${url.serverURL}/user/login`, loginUser);
        // console.log('loginResponse', loginResponse);
        setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user
        });
        localStorage.setItem("auth-token", loginResponse.data.token);
        history.push("/");
        } catch(err) {
            if (err.response){
                setError(err.response.data.msg)
            } else {
                console.log(err);
            }
        }
    };

    return (
        <>
        <Navbar />
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-title">Login Form</div>
                <div className="form-error">
                {error  && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                </div>
                <form onSubmit={submit}>
                    <div className="login-field">
                        <input type="text" id="email" onChange={e => setEmail(e.target.value)} value={email} required/>
                        <label>Email Address</label>
                    </div>
                    <div className="login-field">
                        <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password} required/>
                        <label>Password</label>
                    </div>
                    <div className="login-field">
                        <input type="submit" value="Login" />
                    </div>
                    <div className="login-signup-link">Not a member? <Link to="/user/register">Signup now</Link></div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login
