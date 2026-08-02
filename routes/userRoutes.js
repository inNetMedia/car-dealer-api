const { authUser } = require('../controllers/authController');

const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/usersController'),
    verifyJWT = require('../middlewares/verifyJWT');


router.route('/register').post(usersController.registerUser)
router.route('/auth').post(authUser)

router.route('/activate/:actStr').get(usersController.activateAccount)

router.route('/wishlist')
    .get(verifyJWT, usersController.getWishList)
    .post(verifyJWT, usersController.saveToWish);


module.exports = router