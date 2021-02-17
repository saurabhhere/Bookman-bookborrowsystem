import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import userContext from '../../context/userContext';

const AuthOptions = () => {

    const {userData, setUserData} = useContext(userContext);
    const history = useHistory();
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token","");
        history.push("/user/login");
        notify();
    };


    const notify = () => {
            toast.info('Successfully Logged out!', {position: toast.POSITION.TOP_CENTER});
    }
    
    return (
        <div className="navbar-flex">
        {userData.user ? (
            <>
            <Link to="/register-novel">
                    <div className="navbar-flex-option">
                        Register your Novel
                    </div>
                </Link>
                <Link to="/user/profile">
                    <div className="navbar-flex-option">
                        My Profile
                    </div>
                </Link>
                <Link to="">
                    <div onClick={logout} className="navbar-flex-option">
                        Logout
                    </div>
                </Link>
                </>
        ) : (
            <>
            <Link to="/user/register">
                    <div className="navbar-flex-option">
                        Register
                    </div>
                </Link>
                <Link to="/user/login">
                    <div className="navbar-flex-option">
                        Login
                    </div>
                </Link>
            </>
        )}

        </div>
    )
}

export default AuthOptions
