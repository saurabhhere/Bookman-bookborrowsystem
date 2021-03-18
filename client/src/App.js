import React, { useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import RegisterNovel from './components/RegisterNovel/RegisterNovel';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MainPage from './components/MainPage/MainPage';
import BookPage from './components/BookPage/BookPage';
import axios from 'axios';
import UserContext from './context/userContext';
import Profile from './components/Profile/Profile';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import url from './misc/url'
import AccountActivate from './components/AccountActivate/AccountActivate';

Modal.setAppElement('#root')

function App() {

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null){
        localStorage.setItem("auth-token", "");
        token="";
      }
      const tokenResponse = await axios.post(
        `${url.serverURL}/user/tokenIsValid`, null,
        {headers: {"x-auth-token": token}}
      )
      if (tokenResponse.data) {
        const userRes = await axios.get(`${url.serverURL}/user/`, {
          headers: {"x-auth-token": token},
        });
        setUserData({
          token, 
          user: userRes.data,
        });
      }
    }
    checkLoggedIn();
  }, []);

  
  toast.configure();
  return (
      <Router>
      <UserContext.Provider value={{userData, setUserData}}>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/register-novel" exact component={RegisterNovel} />
          <Route path="/user/login" exact component={Login}/>
          <Route path="/user/register" exact component={Register} />
          <Route path="/user/profile" exact component={Profile}/>
          <Route path="/book/get/:id" exact component={BookPage} />
          <Route path="/authentication/activate/:token" exact component={AccountActivate} />
        </Switch>
      </UserContext.Provider>
      </Router>
  );
}

export default App;
