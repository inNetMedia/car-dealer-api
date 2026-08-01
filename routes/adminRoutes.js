const carController = require('../controllers/carController'),
    upload = require('../middlewares/imgUploads'),
    express = require('express'),
    router = express.Router(),
    rolesList = require('../config/rolesList'),
    verifyJWT = require('../middlewares/verifyJWT'),
    verifyRoles = require('../middlewares/verifyRoles'),
    usersController = require('../controllers/usersController');


router.route('/api/car/:id/mark-sold').put(carController.setCarSold)     //Admin Route
router.route('/api/car/:id/update').put(carController.updateCar)       //Admin Route

router.route('/api/car')
    .post(carController.uploadNewCar)   //Admin Route     
    .delete(carController.deleteCar);    //Admin Route

router.route('/api/car/sold').get(carController.getAllSoldCars)     //Admin Route

router.route('/api/upload').post(upload.array('images', 15), carController.uploadImages) //Admin Route

router.route('/users').get(usersController.getAllUsers) //Admin route

router.route('/createAdmin').post(usersController.createAdmin)


module.exports = router