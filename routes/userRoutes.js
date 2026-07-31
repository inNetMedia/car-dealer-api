const { authUser } = require('../controllers/authController');

const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/usersController');


router.route('/register').post(usersController.registerUser)
router.route('/auth').post(authUser)

router.route('/activate/:actStr').get(usersController.activateAccount)

router.route('/wishlist')
    .get(usersController.getWishList)
    .post(usersController.saveToWish);

router.route('/').get(usersController.getAllUsers) //Admin route

router.route('/createAdmin').post(usersController.createAdmin)


module.exports = router