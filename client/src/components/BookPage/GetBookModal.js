import React, { useState } from 'react'
import Modal from 'react-modal';
import url from '../../misc/url';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import './GetBookModal.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const GetBookModal = ({ userId, bookId, modalIsOpen, setModalIsOpen }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [enrollment, setEnrollment] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        try {
            const contactDetails = { name, email, contact, enrollment, bookId, userId };
            const bookReqResponse = await axios.post(`${url.serverURL}/book/get`, contactDetails);
            // console.log('bookReqResponse', bookReqResponse);
            setName('');
            setEmail('');
            setEnrollment('');
            setContact('');
            notify();
            setModalIsOpen(false);
        } catch (err) {
            console.log(err);
            if (err.response){
                setError(err.response.data.msg);
            }
        }
    };

    const notify = () => {
        toast.success('Contact details mailed to owner succesfully!', {position: toast.POSITION.TOP_CENTER});
}
    return (
        <div>
            <Modal className="getBook-modal" isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={
                    {
                        overlay: {
                            backgroundColor: 'rgba(255,255,255,0.9)'
                        }
                    }
                }
            >
                <div className="modal-close-btn" onClick={() => setModalIsOpen(false)}><AiOutlineCloseSquare /></div>
                <div className="getBook-modal-flex">
                    <div className="getBook-modal-heading">Enter Your Contact Details</div>
                    <div className="form-error">{error}</div>
                    <div className="wrapper">
                        <form onSubmit={submit}>
                            <div className="group">
                                <input type="text" required="required" onChange={e => setName(e.target.value)} value={name}/><span className="highlight"></span><span className="bar"></span>
                                <label>Name</label>
                            </div>
                            <div className="group">
                                <input type="text" required="required" onChange={e => setEmail(e.target.value)} value={email}/><span className="highlight"></span><span className="bar"></span>
                                <label>Email</label>
                            </div>
                            <div className="group">
                                <input type="number" required="required" onChange={e => setContact(e.target.value)} value={contact}/><span className="highlight"></span><span className="bar"></span>
                                <label>Contact No</label>
                            </div>
                            <div className="group">
                                <input type="number" required="required" onChange={e => setEnrollment(e.target.value)} value={enrollment}/><span className="highlight"></span><span className="bar"></span>
                                <label>Enrollment No</label>
                            </div>
                            <div className="btn-box">
                                <button className="btn btn-submit" type="submit">submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default GetBookModal
