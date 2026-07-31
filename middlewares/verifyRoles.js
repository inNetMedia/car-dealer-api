const verifyRoles = (allowedRole) => {
    return (req, res, next) => {
        console.log('verifying roles')
        if(!req?.role) return res.sendStatus(401);
        
        if(req.role != allowedRole){
            return res.sendStatus(401)
        }

        next()
    }
}

module.exports = verifyRoles