const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        console.log('No token provided')
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const verified = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.email = decoded.userInfo.email
            req.role = decoded.userInfo.role;
            next()
        }   
    )
    console.log('Token auth succesful')
};

module.exports = verifyJWT

// const verifyJWT = (req, res, next) => {
//     console.log('Verifying JWT')
//     //Get the token from the authHeader 
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
//     const token = authHeader.split(' ')[1];

//     //Verify token 
//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET, 
//         (err, decoded) => {
//             if(err) return res.sendStatus(403);
//             req.email = decoded.userInfo.email
//             req.role = decoded.userInfo.role;
//             next()
//         }
//     )
// }