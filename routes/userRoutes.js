const { authUser } = require('../controllers/authController');

const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/usersController'),
    verifyJWT = require('../middlewares/verifyJWT');


router.route('/register').post(usersController.registerUser)
router.route('/auth').post(authUser)

router.route('/activate/:actStr').get(usersController.activateAccount)

router.route('/wishlist').post(verifyJWT, usersController.saveToWish);
router.route('/wishlist/:id').get(verifyJWT, usersController.getWishList)

router.route('/logout').get(usersController.logoutUser)

router.route('/sell').post(verifyJWT, usersController.receiveOffer)

module.exports = router