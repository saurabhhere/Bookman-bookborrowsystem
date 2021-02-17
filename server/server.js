const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const usersRoute = require('./Routes/usersRoute');
const booksRoute = require('./Routes/booksRoute');
const getBookRoute = require('./Routes/getBookRoute');

app.use('/uploads', express.static('uploads')); 

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET, POST, PUT, PATCH, DELETE"
}));

app.use('/user', usersRoute);
app.use('/books',booksRoute)
app.use('/book/get', getBookRoute);

app.use('/', (req, res) => {
    res.send('BookMan server is Running')
})
mongoose.connect(process.env.CONNECTION_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`)))
.catch((error) => console.log(`${error} did not connect`));
