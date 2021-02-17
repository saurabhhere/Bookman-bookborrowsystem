import React from 'react'
import BookList from '../BookList/BookList'
import Navbar from '../Navbar/Navbar'
import { Link } from 'react-router-dom'
import './MainPage.css'
import Footer from '../Footer/Footer'

const MainPage = () => {
    return (
        <div>
            <div className="mainpage">
                <Navbar />
                <div className="mainpage-flex">
                    <div>
                        <div className="mainpage-content mainpage-lend">BORROW</div>
                        <div className="mainpage-content mainpage-learn">LEARN</div>
                        <div className="mainpage-content mainpage-return">RETURN</div>
                    </div>
                    <div className="img-wrap">
                        <img src="https://preview.colorlib.com/theme/startright/images/illustration_1.png" />
                    </div>
                </div>
                <div className="get-started-flex">
                    <Link to="/register-novel">
                        <span className="mainpage-get-started" >
                            Get Started
                        </span>
                    </Link>
                    <div></div>
                </div>
            </div>
            <BookList />
            <Footer />
        </div>
    )
}

export default MainPage
