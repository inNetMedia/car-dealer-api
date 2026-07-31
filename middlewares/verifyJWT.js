const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    console.log('Verifying JWT')
    //Get the token from the authHeader 
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    //Verify token 
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.email = decoded.userInfo.email
            req.role = decoded.userInfo.role;
            next()
        }
    )
}

module.exports = verifyJWT