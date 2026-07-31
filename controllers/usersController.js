const asyncHandler = require('express-async-handler'),
    bcrypt = require('bcrypt'),
    User = require('../model/User'),
    sendEmail = require('../services/resendServices');


const registerUser = asyncHandler( async(req, res) => {
    const { email, username, password } = req.body
    if(!req?.body?.email || !req?.body?.username || !req?.body?.password) return res.status(400).json({ message: 'All fields are required to register user'});

    const hashedPwd = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        username,
        password: hashedPwd,
        email,
        role: "user"
    })

    sendEmail(req.body.email, `http://localhost:3500/user/activate/${newUser._id}`)         ///Change the address in production

    console.log(newUser)
    return res.status(200).json({ message: 'Follow the link sent on your email to activate account'})
})


const getAllUsers = asyncHandler( async(req, res) => {
    const users = await User.find()
    if(!users) return res.status(204).json({ message: 'There are currently no users registered'});

    return res.status(200).json(users)
})

const activateAccount = asyncHandler( async(req, res) => {
    const { id } = req.params
    if(!req?.params?.id) return res.status(400).json({ message: `User Id required to activate account`});

    const foundUser = await User.findOne({ _id: req.params.id })
    if(!foundUser) return res.status(400).json({ message: 'User does not have an account'});

    const updatedUser = await User.updateOne({ _id: req.params.id}, { active: true })
    console.log(updatedUser)

    return res.status(200).json({ message: `${foundUser.username} your account has been activated`})
})

const createAdmin = asyncHandler( async(req, res) => {
    const pwd = await bcrypt.hash('0000',10)

    const newAdmin = await User.create({
        username:'Nombasa',
        email: 'nombasa@gmail.com',
        password: pwd,
        active: true,
        role: 199335
    })

    console.log(newAdmin)
    return res.status(200).json({ message: `Admin created` })
})


module.exports = {
    registerUser,
    getAllUsers,
    activateAccount,
    createAdmin
}