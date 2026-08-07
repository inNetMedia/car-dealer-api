const carController = require('../controllers/carController'),
    upload = require('../middlewares/imgUploads'),
    express = require('express'),
    router = express.Router(),
    rolesList = require('../config/rolesList'),
    verifyJWT = require('../middlewares/verifyJWT'),
    verifyRoles = require('../middlewares/verifyRoles'),
    usersController = require('../controllers/usersController');


router.route('/api/car/:id/mark-sold').put(verifyJWT, verifyRoles(rolesList.admin), carController.setCarSold)     //Admin Route
router.route('/api/car/:id/update').put(verifyJWT, verifyRoles(rolesList.admin), carController.updateCar)       //Admin Route

router.route('/api/car')
    .post(verifyJWT, verifyRoles(rolesList.admin), carController.uploadNewCar)   //Admin Route     
    .delete(verifyJWT, verifyRoles(rolesList.admin), carController.deleteCar)
    .get(verifyJWT, verifyRoles(rolesList.admin), carController.getAllCars)    //Admin Route

router.route('/api/car/sold').get(verifyJWT, verifyRoles(rolesList.admin), carController.getAllSoldCars)     //Admin Route

router.route('/api/upload').post(verifyJWT, verifyRoles(rolesList.admin), upload.array('images', 15), carController.uploadImages) //Admin Route

router.route('/users').get(verifyJWT, verifyRoles(roles.admin), usersController.getAllUsers) //Admin route

//router.route('/createAdmin').post(verifyJWT, verifyRoles(rolesList.admin), usersController.createAdmin)


module.exports = router