const asyncHandler = require('express-async-handler'),
    bcrypt = require('bcrypt'),
    User = require('../model/User'),
    Car = require('../model/Car'),
    sendEmail = require('../services/resendServices'),
    { v4: uuid } = require('uuid'),
    path = require('path')


const registerUser = asyncHandler( async(req, res) => {
    const { email, username, password } = req.body
    if(!req?.body?.email || !req?.body?.username || !req?.body?.password) return res.status(400).json({ message: 'All fields are required to register user'});

    //Check for duplicate user
    const foundUser = await User.findOne({ email: req.body.email })
    if(foundUser) return res.status(409).json({ message: `User already exists` });
    const hashedPwd = await bcrypt.hash(password, 10)
    const activationStr = uuid()

    const newUser = await User.create({
        username,
        password: hashedPwd,
        email,
        activationStr,
        role: "user"
    })
    const actLink = `http://localhost:3500/user/activate/${newUser.activationStr}`
    const msg = `<h1>
                    Hi ${req.body.username}, activate your account below
                </h1><br>
                <a href="${actLink}">
                <button style="background-color:black; color:white; padding:1rem;">Activate</button>
                </a>
                `

    sendEmail(req.body.email, msg,`Activate your account` )        ///Change the address in production

    console.log(newUser)
    return res.status(200).json({ message: 'Follow the link sent on your email to activate account'})
})


const getAllUsers = asyncHandler( async(req, res) => {
    const users = await User.find()
    if(!users) return res.status(204).json({ message: 'There are currently no users registered'});

    return res.status(200).json(users)
})

const activateAccount = asyncHandler( async(req, res) => {
    const { actStr } = req.params
    if(!req?.params?.actStr) return res.status(400).json({ message: `User Id required to activate account`});

    const foundUser = await User.findOne({ activationStr: req.params.actStr })
    if(!foundUser) return res.status(400).json({ message: 'User does not have an account'});

    const updatedUser = await User.updateOne({ activationStr: req.params.actStr }, { active: true })
    console.log(updatedUser)

    return res.status(200).sendFile(path.join(__dirname, '..', 'views', 'activation.html'))
})

const saveToWish = asyncHandler( async(req, res) => {
    const { userId, listingId } = req.body
    if(!req?.body?.userId || !req?.body?.listingId) return res.status(400).json({ message:`All fields are required` });

    const foundUser = await User.findOne({ _id: userId })
    if(!foundUser) return res.status(400).json({ warning: `User not found` });

    //Check for duplicate wishList entry
    if(foundUser.wishList.includes(req.body.listingId)) return res.status(209).json({ message: 'The listing already exists'}); 

    const foundListing = await Car.findOne({ _id: listingId });
    if(!foundListing) return res.status(400).json({ message: 'Car listing not found, try again later' });

    const updatedList = await User.updateOne({ _id: req.body.userId }, { wishList: [...foundUser.wishList, foundListing._id] })
    console.log(updatedList)

    return res.status(200).json({ message: `${foundListing.brand} added to ${foundUser.username} wish list`})
})


const getWishList = asyncHandler( async(req, res) => {
    const { id } = req.params.id
    if(!req?.params?.id) return res.status(400).json({ message: `Id required to get wish list`});

    const foundUser = await User.findOne({ _id: req.params.id }).populate('wishList')
    if(!foundUser) return res.status(400).json({ message: `User not found` });
    
    if(!foundUser.wishList.length) return res.status(200).json({ message: "You currently don't have anything in your wish list"})

    return res.status(200).json(foundUser.wishList)
})

const removeWishList = asyncHandler( async(req, res) => {
    const { userId, listingId } = req.body
    if(!req?.body?.userId || !req?.body?.listingId) return res.status(400).json({ message:`All fields are required` });

    const foundUser = await User.findOne({ _id: req.body.userId })
    if(!foundUser) return res.status(400).json({ message: `User not found` });

    const filteredArray = foundUser.wishList.filter((item) => item.toString() !== listingId)
    const updatedList = await User.updateOne({ _id: req.body.userId }, { wishList: filteredArray })
    console.log(updatedList)
    console.log(filteredArray[0])
    return res.status(200).json({ message:`Car listing removed from favourites` })
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


const logoutUser = asyncHandler( async(req, res) => {
    if(!req?.cookies?.token) return res.status(200);

    const token = req.cookies.token
    console.log(`token is ${token}`)
    res.clearCookie('token', { httpOnly: true, maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production'});
    return res.status(200).json({ message: 'Logged out successfully'})
})

const receiveOffer = asyncHandler( async(req, res) => {
    if(!req?.body) return res.status(400).json({ message: `Body Content required`});

    const foundUser = await User.findOne({ _id: req.body.id })
    if(!foundUser) return res.status(400).json({ message: 'Create an account to send offer'});

    //Check if the emails match
    if(req.body.email !== foundUser.email) return res.status(409).json({ message: 'User emails do not match'});
    const valuation = 'Asking for valuation'

    const msg = `
            <h2>${foundUser.username} has a vehicle offer</h2>
            <h2>Car Details</h2>
            <p><b>Make:</b> ${req.body.make}</p>
            <p><b>Model:</b> ${req.body.model}</p>
            <p><b>Condition:</b> ${req.body.condition}</p>
            <p><b>Asking Price(R):</b> ${req.body.price || valuation}</p>
            <p><b>Year:</b> ${req.body.year}</p>
            <p><b>Phone:</b> ${req.body.phone}</p>
            <p><b>Transmission:</b> ${req.body.transmission}</p>
            <p><b>Color:</b> ${req.body.color}</p>
            <h2>More info</h2>
            <p>${req.body.details}</p>
    `

    sendEmail(`sammyphala99@gmail.com`, msg, `Car Offer`)

    res.status(201).json({ message: `Offer submitted!`})
})


module.exports = {
    registerUser,
    getAllUsers,
    activateAccount,
    createAdmin,
    saveToWish,
    getWishList,
    logoutUser,
    receiveOffer,
    removeWishList
}