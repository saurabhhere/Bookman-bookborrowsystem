import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Book from './Book/Book';
import './BookList.css';
import { FaSearch } from 'react-icons/fa'
import url from "../../misc/url"

const BookList = () => {

    const [books, setBooks] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState('');
    const [searchBook, setSearchBook] = useState("");
    const [sort, setSort] = useState('');

    const pages = new Array(totalPages).fill(null).map((v, i) => i);


    useEffect(() => {
        if (searchBook != "" || sort == "TimeDesc" || sort == "TimeAsc" || sort == "PriceAsc" || sort == "PriceDesc" || sort == "BookName" || sort == "AuthorName"){
            // console.log(sort, searchBook)
            setPageNumber(0);
            setTotalPages(1);
            axios.get(`${url.serverURL}/books/all`)
                .then((res) => {
                    if (sort == "AuthorName"){
                        setBooks(res.data.sort(                        
                            (a,b) => {return a.author.toLowerCase()>b.author.toLowerCase() ? 1 : -1}
                            ).filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    } else if (sort == "BookName"){
                        setBooks(res.data.sort(                        
                            (a,b) => {return a.book.toLowerCase()>b.book.toLowerCase() ? 1 : -1}
                            ).filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    } else if (sort == "PriceAsc"){
                        setBooks(res.data.sort(                        
                            (a,b) => {return a.price - b.price}
                            ).filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    } else if (sort == "PriceDesc"){
                        setBooks(res.data.sort(                        
                            (a,b) => {return b.price - a.price}
                            ).filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    } else if (sort=="TimeAsc"){
                        setBooks(res.data.sort(                        
                            (a,b) => {return new Date(a.time).valueOf() - new Date(b.time).valueOf()}
                            ).filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    } else if (sort=="TimeDesc"){
                        setBooks(res.data.sort(                        
                            (a,b) => {return new Date(b.time).valueOf() - new Date(a.time).valueOf()}
                            ).filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    } else {
                        setBooks(res.data.filter((book) => {
                            if (book.book.toLowerCase().includes(searchBook.toLowerCase())||book.author.toLowerCase().includes(searchBook.toLowerCase())) {
                                return book;
                            }
                        }))
                    }
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            axios.get(`${url.serverURL}/books?page=${pageNumber}`)
                    .then((res) => {
                        setBooks(res.data.booksList);
                        setTotalPages(res.data.totalPages);
                    }).catch((err) => {
                        console.log(err);
                    })
        }

    }, [searchBook, pageNumber, sort])

    const clearSort = () => {
        setSort('');
    }

    const clearSearch = () => {
        setSearchBook('');
    }

    const gotoPrevious = () => {
        setPageNumber(Math.max(0, pageNumber - 1))
    }

    const gotoNext = () => {
        setPageNumber(Math.min(totalPages - 1, pageNumber + 1))
    }

    return (
        <div className="booklist-container">
            <div className="booklist-heading">Available Books</div>
            <div className="search-books">
                <div> </div>
                <div className="sort-box">
                <form >
                    <div className="search-input">
                        <input type="text" placeholder="Search by book or author" value={searchBook} onChange={e => setSearchBook(e.target.value)} required />
                        <button className="search-btn" type="submit">
                            <FaSearch />
                        </button>
                    </div>
                </form>
                <div onClick={clearSearch} className="clear-sort-btn">Clear Search</div>
                </div>
                <div className="sort-box">
                    <select onClick={e => setSort(e.target.value)} className="sort-container">
                        <option className="sort-option" selected={true} disabled="disabled">Sort By</option>
                        <option value="TimeAsc" className="sort-option">Oldest First</option>
                        <option value="TimeDesc" className="sort-option">Newest First</option>
                        <option value="PriceAsc" className="sort-option">Price Low to High</option>
                        <option value="PriceDesc" className="sort-option">Price High to Low</option>
                        <option value="BookName" className="sort-option">Book Name</option>
                        <option value="AuthorName" className="sort-option">Author Name</option>
                    </select>
                    <div onClick={clearSort} className="clear-sort-btn">Clear sort</div>
                </div>
            </div>
            <div className="page-count">Page {pageNumber + 1} of {totalPages}</div>
            <div className="booklist">
                {books.map((book) => (
                    <Book key={book._id} id={book._id} name={book.book} author={book.author} image={book.bookImage} />
                ))}
            </div>
            <div className="pagination">
                <button className="previous-btn" onClick={gotoPrevious}>❮</button>
                {pages.map((pageIndex) => (
                    <button key={pageIndex} className={`pagination-no`} onClick={() => setPageNumber(pageIndex)}>{pageIndex + 1}</button>
                ))}
                <button className="next-btn" onClick={gotoNext}>❯</button>
            </div>
        </div>
    )
}

export default BookList
