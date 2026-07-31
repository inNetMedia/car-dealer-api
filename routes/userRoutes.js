const { authUser } = require('../controllers/authController');

const express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/usersController');


router.route('/register').post(usersController.registerUser)
router.route('/auth').post(authUser)

router.route('/activate/:id').get(usersController.activateAccount)

router.route('/').get(usersController.getAllUsers) //Admin route

router.route('/createAdmin').post(usersController.createAdmin)


module.exports = router