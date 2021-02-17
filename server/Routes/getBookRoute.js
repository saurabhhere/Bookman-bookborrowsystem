const express = require('express');
const BookRequests = require('../models/getBooksUsers');
const router = express.Router();
const nodemailer = require('nodemailer');
const BooksModel = require('../models/books');

router.post ('/', async (req, res) => {
    try {
        const {name, email, contact, enrollment, bookId, userId} = req.body;
        if (!name || !email || !contact || !enrollment || !bookId){
            return res.status(400).json({
                msg: "Not all fields have been entered."
            });
        }
        if (!(/^[0-9]+$/.test(enrollment))){
            return res.status(400).json({
                msg: "Enrollment no can contain only digits"
            })
        }
        if (!(/^[6789]\d{9}$/.test(contact))){
            return res.status(400).json({
                msg: "Please enter a valid contact number"
            })
        }
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase()))){
            return res.status(400).json({
                msg: "Invalid Email"
            })
        }
        const obj = {
            name: name,
            email: email,
            contact: contact,
            enrollment: enrollment,
            bookId: bookId,
            authenticatedUserId: userId,
        }


        const newBookReq = new BookRequests(obj);
        await newBookReq.save();

        try {
            const book = await BooksModel.findById(bookId);
            // console.log("bookDetails",book);
            let transporter = nodemailer.createTransport({
                service: "Yahoo",
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
    
            const mail = `
                <p>Hi ${book.owner}, You have received a new request for your book "${book.book}"</p>
                <h3>Contact details</h3>
                    <ul>
                        <li>Name: ${name}</li>
                        <li>Email: ${email}</li>
                        <li>Contact: ${contact}</li>
                        <li>Enrollment: ${enrollment}</li>
                    </ul>
                    <p>Your early response will be highly appreciated.</p>`

            let mailOptions = {
                from: '"Bookman" <saurabhguptajpr@yahoo.in>',
                to: book.email,
                subject: "New Request on Bookman",
                html: mail
            }
            
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error){
                    return console.log(error);
                }
                // console.log('Message sent:', info.messageId);
                res.status(200).json(newBookReq);
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(409).json({message: error.message});
    }
})

module.exports = router;