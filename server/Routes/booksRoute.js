const express = require('express');
const BooksModel = require('../models/books');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null,new Date().toISOString() + file.originalname)
    }
}); 


const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
 
const upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}, fileFilter: fileFilter});


router.post('/register', upload.single('bookImage'), async (req, res, next) => {
    // console.log('req.file', req.file);
    // console.log('req.body', req.body);
    try {
        const {book, author, price, desc, owner, email, mobile} = req.body;
        const obj = {
            book: req.body.book,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            owner: req.body.owner,
            email: req.body.email,
            mobile: req.body.mobile,
            bookImage: req.file.path,
            authenticatedUserId: req.body.authenticatedUserId
        }
        if (!book || !author || !price || !desc || !owner || !email || !mobile || !obj.bookImage){
            return res.status(400).json({
                msg: "Not all fields have been entered."
            });
        }
        if (!(/^[0-9]+$/.test(price))){
            return res.status(400).json({
                msg: "Price can contain only digits"
            })
        }
        if (!(/^[6789]\d{9}$/.test(mobile))){
            return res.status(400).json({
                msg: "Please enter a valid number"
            })
        }
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase()))){
            return res.status(401).json({
                msg: "Invalid Email"
            })
        }   
        const newBookPost = new BooksModel(obj);
        await newBookPost.save();
        res.status(201).json(newBookPost);        
    } catch (error) {
        res.status(409).json({message: error.message});
    }
})

router.get('/', async (req, res) => {
    const PAGE_SIZE = 10;
    const page = parseInt(req.query.page || "0");
    try {
        const booksList = await BooksModel.find().limit(PAGE_SIZE).skip(PAGE_SIZE * page);
        const total = await BooksModel.countDocuments({});
        res.status(200).json({totalPages: Math.ceil(total/PAGE_SIZE),
             booksList
            });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

router.get('/all', async (req, res) => {
    try {
        const booksList = await BooksModel.find();
        res.status(200).json(booksList);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

router.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await BooksModel.findById(id);
        res.status(202).json(book);
    } catch (error) {
        res.status(405).json({message: error.message});
    }
})

router.get('/get/:userid', async (req, res) => {
    const {userid} = req.params;
    try {
        const books = await BooksModel.find({authenticatedUserId: userid});
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router;