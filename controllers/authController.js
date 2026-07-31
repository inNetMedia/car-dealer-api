const asyncHandler = require('express-async-handler'),
    bcrypt = require('bcrypt'),
    User = require('../model/User'),
    jwt = require('jsonwebtoken');


const authUser = asyncHandler( async(req, res) => {
    const { email, password } = req.body
    if(!req?.body?.email || !req?.body?.password) return res.status(400).json({ message: 'All fields are required' });

    const foundUser = await User.findOne({ email: req.body.email });
    if(!foundUser) return res.sendStatus(401);

    const correctPwd = await bcrypt.compare(password, foundUser.password)
    if(!correctPwd) return res.sendStatus(401);

    //Create JWTs
    //const roles = Object.values(foundUser.roles)
    const  accessToken = jwt.sign(
            { 
                "userInfo": {
                "email":foundUser.email,
                "role":foundUser.role
                }
            },              
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn:'300s'}
        )

    const refreshToken = jwt.sign(
        {"userName":foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn:'1d'}
    )

    //Send the refreshToken to the user who logged in inside the db
    foundUser.refreshToken = refreshToken
    await foundUser.save()
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure:true});
    res.status(200).json({ accessToken })
})


module.exports = {
    authUser
}