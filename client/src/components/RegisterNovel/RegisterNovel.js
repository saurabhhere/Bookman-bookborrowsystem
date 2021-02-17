import React, { useContext, useEffect, useState } from 'react'
import './RegisterNovel.css';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import userContext from '../../context/userContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../../misc/ErrorNotice';
import Modal from 'react-modal';
import url from '../../misc/url'
import {AiOutlineCloseSquare} from 'react-icons/ai';
import {Link} from 'react-router-dom'

const RegisterNovel = () => {

    const [book, setBook] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [bookImage, setbookImage] = useState('');
    const [desc, setDesc] = useState('');
    const [owner, setOwner] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const fileSelectHandler = (e) => {
        e.preventDefault();
        setbookImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("book", book);
        formData.append("author", author);
        formData.append("price", price);
        formData.append("desc", desc);
        formData.append("owner", owner);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("bookImage", bookImage);
        formData.append("authenticatedUserId", userData.user.id); 

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        await axios.post(`${url.serverURL}/books/register`, formData, config).then((res) => {
            // console.log(res);
            setBook('');
            setAuthor('');
            setPrice('');
            setDesc('');
            setOwner('');
            setEmail('');
            setMobile('');
            setbookImage('');
            if (res) {
                setModalIsOpen(true);
            }
        }).catch((error) => {
            const err = error.response.data.msg;
            if (err){
                setError(err);
            }
        })

    }

    const { userData } = useContext(userContext);
    const history = useHistory();
    var isFirstTime = true;
    useEffect(() => {
        if (!isFirstTime){
            if (!userData.user)
                history.push("/");
        }
        isFirstTime = false;
    }, [userData])

    return (

        <>
            <Navbar />
            {userData.user ? (
                <div className="register-book-container">
                    <div className="register-book-wrapper">
                        <div className="register-book-title">Register your book here</div>
                        <div className="form-error">
                            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                        </div>
                        <form type="submit" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="register-book-flex">
                                <div className="book-details">
                                    <h2 className="register-book-subpart">Book Details</h2>
                                    <div className="register-book-field">
                                        <input value={book} onChange={(e) => setBook(e.target.value)} type="text" id="book" name="book" required />
                                        <label>Book Name</label>
                                    </div>
                                    <div className="register-book-field">
                                        <input value={author} onChange={(e) => setAuthor(e.target.value)} type="text" id="author" name="author" required />
                                        <label>Author Name</label>
                                    </div>
                                    <div className="register-book-field">
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" id="price" name="price" required />
                                        <label>Price</label>
                                    </div>
                                    <div className="register-book-field register-book-field-desc">
                                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} type="text" id="desc" name="desc" required />
                                        <label>Short Description about book</label>
                                    </div>
                                    <div className="register-book-field register-book-field-bookCover">
                                        <input type="file" onChange={fileSelectHandler} filename="bookImage" id="bookImage" name="bookImage" />
                                        <label>BookCover Image</label>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <h2 className="register-book-subpart">Contact Details</h2>
                                    <div className="register-book-field">
                                        <input value={owner} onChange={(e) => setOwner(e.target.value)} type="text" id="owner" name="price" required />
                                        <label>Owner Name</label>
                                    </div>
                                    <div className="register-book-field">
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="email" name="email" required />
                                        <label>Email</label>
                                    </div>
                                    <div className="register-book-field">
                                        <input value={mobile} onChange={(e) => setMobile(e.target.value)} type="text" id="mobile" name="mobile" required />
                                        <label>Mobile No</label>
                                    </div>
                                </div>
                            </div>
                            <div className="register-book-field">
                                <input type="submit" value="Register" />
                            </div>
                        </form>
                    </div>
                    <div className="Modal">
                        <Modal className="modal" isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            style={
                                {
                                    overlay: {
                                        backgroundColor: 'rgba(255,255,255,0.9)'

                                    },
                                    content: {
                                        color: 'orange'
                                    }
                                }
                            }
                        >
                                <div className="modal-close-btn" onClick={() => setModalIsOpen(false)}><AiOutlineCloseSquare/></div>
                                <div className="modal-flex">
                            <div className="modal-heading">Your book is Registered Successfully !</div>
                            <div className="modal-desc">You can view it in availaible books section <br />Ps: Refresh if you can't find your book</div>
                            <a href={`${url.clientURL}`}>
                                <div className="modal-btn">Go Home</div>
                            </a>
                                </div>
                        </Modal>
                    </div>
                </div>
            ) : (
                    <div className="register-book-unauthenticated">
                    <div>
                        You are not logged in. Please <Link to="/user/login">Log in</Link> to continue
                    </div>
                    </div>
                )}

        </>
    )
}

export default RegisterNovel
