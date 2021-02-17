const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const UserModel = require("../models/users");

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
            res.status(400).json({
                msg: "An account with this email already exists"
            });
        }

        const existingEnrollment = await UserModel.findOne({enrollment: enrollment});
        if (existingEnrollment){
            res.status(400).json({
                msg: "An account with this enrollment already exists"
            });
        }

        if (!username) username=email;
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
        res.status(200).json(savedUser);
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

module.exports = router;