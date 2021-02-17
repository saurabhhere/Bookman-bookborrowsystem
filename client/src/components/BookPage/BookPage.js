import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import './BookPage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GetBookModal from './GetBookModal';
import userContext from '../../context/userContext';
import url from '../../misc/url';

const BookPage = () => {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState();
    const [owner, setOwner] = useState('');
    const [image, setImage] = useState('');
    const [lendingPrice, setLendingPrice] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { id } = useParams();

    const { userData, setUserData } = useContext(userContext);

    useEffect(() => {
        // console.log(id);
        axios.get(`${url.serverURL}/books/detail/${id}`)
            .then((res) => {
                // console.log(res.data);
                setName(res.data.book);
                setAuthor(res.data.author);
                setPrice(res.data.price);
                setOwner(res.data.owner);
                setDesc(res.data.desc);
                setImage(res.data.bookImage);
                if (res.data.price <=200){
                    setLendingPrice(10);
                } else if (res.data.price <=500){
                    setLendingPrice(15);
                } else if (res.data.price <=700){
                    setLendingPrice(20);
                } else if (res.data.price <= 1000){
                    setLendingPrice(25);
                } else {
                    setLendingPrice(30);
                }
            })
    }, [userData])

    return (
        <>
            <Navbar />
            <div className="bookpage">
                <div className="bookpage-book-name">
                    {name}
                </div>
                <div className="bookpage-flex">
                    <div className="bookpage-image">
                        <img src={`http://localhost:5000/${image}`} />
                    </div>
                    <div className="bookpage-details">
                        <div className="bookpage-author-name">
                            - {author}
                        </div>
                        <div className="bookpage-short-desc">
                            About book:
                        <div>
                                {desc}
                            </div>
                        </div>
                        <div className="owner-flex">
                            <div>
                                <div className="bookpage-market-price">
                                    Market Price:
                                <div>
                                        Rs. {price}
                                    </div>
                                </div>
                                <div className="bookpage-quoted-price">
                                    Lending Price:
                            <div>
                                        {/* Rs. {Math.floor(price/10)} /week */}
                                        Rs. {lendingPrice} /week
                            </div>
                                </div>
                            </div>
                            <div className="bookpage-owner-name">
                                Owner Name:
                            <div>

                                    {owner}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                {userData.user ? (
                    <>
                        <div className="button-flex">
                            <button className="bookpage-getnow" onClick={e => setModalIsOpen(true)}>
                                Get Now
                            </button>
                        </div>
                        <div className="Modal">
                            <GetBookModal userId={userData.user.id ? userData.user.id : ''} bookId={id} modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                        </div>
                    </>
                ) : (
                        <div className="button-flex get-btn-unauthenticated">Please log in to get this book.</div>
                    )}

            </div>

        </>
    )
}

export default BookPage
