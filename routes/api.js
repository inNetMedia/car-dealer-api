const carController = require('../controllers/carController'),
    upload = require('../middlewares/imgUploads'),
    express = require('express'),
    router = express.Router(),
    rolesList = require('../config/rolesList'),
    verifyJWT = require('../middlewares/verifyJWT'),
    verifyRoles = require('../middlewares/verifyRoles');


router.route('/api/car').get(carController.getAllCars);

router.route('/api/car/filter').get(carController.filterResults)
router.route('/api/car/search').get(carController.searchCars)
router.route('/api/car/:id').get(carController.getCar)




module.exports = router