import React from 'react'
import { Link } from 'react-router-dom';
import './Book.css';
import url from '../../../misc/url';

const Book = ({id, name, author, image }) => {
    return (
        <Link to={`book/get/${id}`}>
            <div className="book">
                <div className="book-image">
                    <img src={`${url.serverURL}/${image}`} />
                </div>
                <div className="book-name">{name}</div>
                <div className="book-author">{author}</div>
                <div className="get-book">Get Now</div>
            </div>
        </Link>
    )
}

export default Book
