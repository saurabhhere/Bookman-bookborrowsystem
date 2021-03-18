const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const UserModel = require("../models/users");
const nodemailer = require('nodemailer');

// Register
router.post("/register", async (req, res) => {
    try {
        let {username, email, enrollment, branch, year, password, passwordCheck} = req.body;

        // validate
        if (!username || !email || !enrollment || !branch || !year || !password || !passwordCheck){
            return res.status(400).json({
                msg: "Not all fields have been entered."
            });
        }
        if (password.length < 5){
            return res.status(400).json({
                msg: "The password needs to be atleast 5 characters long"
            });
        }
        if (password != passwordCheck){
            return res.status(400).json({
                msg: "Enter the same password twice for verification"
            })
        }
        if (!(/^[0-9]+$/.test(enrollment))){
            return res.status(400).json({
                msg: "Enrollment no can contain only digits"
            })
        }
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase()))){
            return res.status(400).json({
                msg: "Invalid Email"
            })
        }
        const existingUser = await UserModel.findOne({email: email});
        if (existingUser){
            return res.status(400).json({
                msg: "An account with this email already exists"
            });
        }

        const existingEnrollment = await UserModel.findOne({enrollment: enrollment});
        if (existingEnrollment){
            return res.status(400).json({
                msg: "An account with this enrollment already exists"
            });
        }

        if (!username) username=email;

        const token = jwt.sign({ username, email, password, enrollment, branch, year }, process.env.JWT_SECRET, { expiresIn: '20m' });

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
            <h2>Please click on given link to activate your account</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>    
        `

        let mailOptions = {
            from: '"Bookman" <saurabhguptajpr@yahoo.in>',
            to: email,
            subject: "Account Activation",
            html: mail
        }


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent:', info.messageId);
            return res.status(200).json({ message: "Email has been sent, kindly activate your account" });
        })

        // const salt = await bcrypt.genSalt();
        // const passwordHash = await bcrypt.hash(password, salt);
        // const newUser = new UserModel({
        //     username,
        //     email,
        //     enrollment,
        //     branch,
        //     year,
        //     password: passwordHash,

        // });
        // const savedUser = await newUser.save();
        // res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        // validate
        if (!email || !password){
            return res.status(400).json({
                msg: "Not all fields have been entered."
            })
        };
        const user = await UserModel.findOne({email: email});
        if (!user) {
            return res.status(400).json({
                msg: "No account with this email has been registered"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }
        // we can add expiresIn parameter in sec
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({
            token, user: {
                id: user._id,
                username: user.username
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
});

// Delete
router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await UserModel. findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Check if token is valid
router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.json(false);
        }
        const user = await UserModel.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.get("/", auth, async(req, res) => {
    const user = await UserModel.findById(req.user);
    res.json({
        username: user.username,
        id: user._id
    })
})

router.get("/profile/:id", async(req, res) => {
    const {id} = req.params;
    try {
        const user = await UserModel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.post("/email-activate", async (req, res) => {
    try {
        const { token } = req.body;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err){
                    return res.status(400).json({ error: "Incorrect or expired Link." })
                }
                const { username, email, password, enrollment, branch, year } = decodedToken;
                const existingUser = await UserModel.findOne({ email: email });
                if (existingUser) {
                    res.status(400).json({
                        msg: "An account with this email already exists"
                    });
                }
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);
                const newUser = new UserModel({
                    username,
                    email,
                    enrollment,
                    branch,
                    year,
                    password: passwordHash,
                });
                const savedUser = await newUser.save();
                return res.status(200).json(savedUser);
            })
        } else {
            return res.json({ error: "Error in verifying account. Please try again" })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

module.exports = router;