const carController = require('../controllers/carController'),
    upload = require('../middlewares/imgUploads'),
    express = require('express'),
    router = express.Router(),
    rolesList = require('../config/rolesList'),
    verifyJWT = require('../middlewares/verifyJWT'),
    verifyRoles = require('../middlewares/verifyRoles');


router.route('/api/car')
    .post(carController.uploadNewCar)   //Admin Route     
    .delete(carController.deleteCar)    //Admin Route
    .get(carController.getAllCars);     

router.route('/api/car/filter').get(carController.filterResults)
router.route('/api/car/sold').get(carController.getAllSoldCars)     //Admin Route
router.route('/api/car/:id/mark-sold').put(carController.setCarSold)     //Admin Route

router.route('/api/car/:id').get(carController.getCar)
router.route('/api/car/:id/update').put(carController.updateCar)       //Admin Route


router.route('/api/upload').post(upload.array('images', 15), carController.uploadImages)


module.exports = router