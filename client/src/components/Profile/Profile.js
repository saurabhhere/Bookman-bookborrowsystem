import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../context/userContext';
import Navbar from '../Navbar/Navbar';
import './Profile.css';
import {Link} from 'react-router-dom';
import url from '../../misc/url'

const Profile = () => {

    const [user, setUser] = useState('');
    const [booksRegistered, setBooksRegistered] = useState([]);
    const { userData, setUserData } = useContext(userContext);
    const [firstForBooks, setfirstForBooks] = useState(true)

    useEffect(() => {
        if (!userData.user) {
            setfirstForBooks(false);
        } else {
            axios.get(`${url.serverURL}/books/get/${userData.user.id}`)
                .then((res) => {
                    // console.log("books", res.data);
                    setBooksRegistered(res.data);
                }).catch((error) => {
                    console.log(error.response.data.message)
                })
            // console.log('userData', userData.user.id);
            axios.get(`${url.serverURL}/user/profile/${userData.user.id}`)
                .then((res) => {
                    // console.log("user", res.data);
                    setUser(res.data);
                }).catch((err) => {
                    console.log(err);
                })
        }
    }, [userData])




    return (
        <div>
            <Navbar />
            {userData.user ? (
                <>
                    <div className="profile-container">
                        <div className="profile-heading">User Profile</div>
                        <div className="profile-flex">
                            <div className="profile-name">
                                Hello
                                <div className="name">{user.username}</div>
                            </div>
                            <div className="profile-details">
                                <div className="profile-details-flex">
                                    <div className="detail-component">
                                        <div className="detail">Enrollment no </div>
                                        <div>{user.enrollment}</div>
                                    </div>
                                    <div className="detail-component">
                                        <div className="detail">Branch</div>
                                        <div>{user.branch}</div>
                                    </div>
                                    <div className="detail-component">
                                        <div className="detail">Year</div>
                                        <div>{user.year}</div>
                                    </div>
                                    <div className="detail-component">
                                        <div className="detail">Email</div>
                                        <div>{user.email}</div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="profile-books-heading">Books Registered by you</div>
                        <div className="profile-books-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Book Name</th>
                                        <th>Author</th>
                                        <th>Price</th>
                                        <th>Contact Email</th>
                                        <th>Contact Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {booksRegistered.length ? (
                                    booksRegistered.map((book) => (
                                        <tr key={book._id}>
                                            <td>{book.book}</td>
                                            <td>{book.author}</td>
                                            <td>{book.price}</td>
                                            <td>{book.email}</td>
                                            <td>{book.mobile}</td>
                                        </tr>
                                    ))
                                ) : (
                                    "No books Registered by you yet."
                                )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </>
            ) : (
                    <div className="profile-page-unauthenticated"> 
                        Please <Link  to="/user/login"><span className="login-link"> Log In </span></Link> to continue
                    </div>
                )}
        </div>
    )
}

export default Profile
