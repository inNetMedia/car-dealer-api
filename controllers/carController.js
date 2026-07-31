const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2
const Car = require('../model/Car');


const uploadNewCar = asyncHandler( async(req, res) => {
    if(!req.body) return res.status(400).json({ message: `All fields are required` });

    //Save everything to the DB
    const uploadedCar = await Car.create({
        model: req.body.model,
        images: req.body.images,
        variant: req.body.variant,
        year: req.body.year,
        price: req.body.price,
        description: req.body.description,
        features: req.body.features,
        brand: req.body.brand,
        mileage: req.body.mileage,
        category: req.body.category,
        specs:{
            transmission: req.body.specs.transmission,
            engine: {
                maxPower: req.body.specs.engine.maxPower,
                acceleration: req.body.specs.engine.acceleration,
                size: req.body.specs.engine.size,
                position: req.body.specs.engine.position,
                emmisions: req.body.specs.emmisions,
                capacity: req.body.specs.engine.capacity,
                cylinderLayout: req.body.specs.engine.cylinderLayout,
                fuelType: req.body.specs.engine.fuelType,
                fuelCapacity: req.body.specs.engine.fuelCapacity,
                fuelConsuption: req.body.specs.engine.fuelConsuption,
                range: req.body.specs.engine.range,
                torque: req.body.specs.engine.torque
            },
            handling: {
                powerSteering: req.body.specs.handling.powerSteering,
                tractionCtrl: req.body.specs.handling.tractionCtrl,
                driveTrain: req.body.specs.handling.driveTrain
            },
            comfort: {
                AC: req.body.specs.comfort.AC,
                electricWindows: req.body.specs.comfort.electricWindows,
                seats: req.body.specs.comfort.seats,
                doors: req.body.specs.comfort.doors
            },
            tech: {
                steeringWheelCtrl: req.body.specs.tech.steeringWheelCtrl,
                onboardPC: req.body.specs.tech.onboardPC,
                bluetooth: req.body.specs.tech.bluetooth,
                USBport: req.body.specs.tech.USBport
            },
            safety: {
                airbagQty: req.body.specs.safety.airbagQty,
                ISOFIX: req.body.specs.safety.ISOFIX,
                ABS: req.body.specs.safety.ABS,
                cruiseCtrl: req.body.specs.safety.cruiseCtrl,
                remoteCentralLocking: req.body.specs.safety.remoteCentralLocking,
                lampTech: req.body.specs.safety.lampTech
            }
        }
    })

    console.log(uploadedCar)

    return res.status(200).json({ message: `Files uploaded` })
})

const uploadImages = asyncHandler( async(req, res) => {
    if(!req.files) return res.status(400).json({ message:'Image files required' });
    const uploadedUrls = []

    for (const file of req.files) {
      // 1. Convert the buffer to a base64 string
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // 2. Upload straight to Cloudinary using standard syntax
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'dealership_cars'
      });

      // 3. Save the public URL
      uploadedUrls.push(result.secure_url);
    }

    res.status(200).json({ "images": uploadedUrls })
})

const deleteCar = asyncHandler( async(req, res) => {
    const { id } = req.body 
    if(!req?.body?.id) return res.status(400).json({ message:`Id required to delete car listing` });

    const foundListing = await Car.findOne({ _id: req.body.id })
    if(!foundListing) return res.status(400).json({ message:`Car listing with id ${req.body.id} not found`});

    const deletedListing = await Car.deleteOne({ _id: req.body.id })
    console.log(deletedListing)
    return res.status(200).json({ message: `Listing ${foundListing.id} deleted`})
})


const updateCar = asyncHandler( async(req, res) => {
    const { id } = req.params
    if(!req?.params?.id || !req?.body) return res.status(400).json({ warning: `Listing Id required to update`});

    const foundListing = await Car.findOne({ _id: id })
    if(!foundListing) return res.status(400).json({ message: `Listing with id ${req.params.id} not found`});

    const updatedListing = await Car.updateOne({ _id: req.params.id }, req.body)

    console.log(updatedListing)
    return res.status(200).json({ message: `Listing ${req.params.id} updated!`})
})


const getCar = asyncHandler( async(req, res) => {
    const { id } = req.params.id
    if(!req?.params?.id) return res.status(400).json({ warning: `Listing id required`});

    const foundListing = await Car.findOne({ _id: req.params.id })
    if(!foundListing) return res.status(400).json({ message: `Car listing not found`});

    return res.status(200).json(foundListing)
})



const getAllCars = asyncHandler( async(req, res) => {
    const cars = await Car.find()
    if(!cars) return res.status(204).json({ message: `There are currently no car listings`});

    return res.status(200).json(cars)
})


const getAllSoldCars = asyncHandler( async(req, res) => {
    console.log(`GetAllCars Funtion running`)
    const soldCars = await Car.find({ sold: true })
    if(!soldCars) return res.status(204).json({ message: `There are currently no sold car listings`});

    return res.status(200).json(soldCars)
})



const setCarSold = asyncHandler( async(req, res) => {
    const { id } = req.params
    if(!req?.params?.id) return res.status(400).json({ message: `Listing Id required to update listing status`});

    const foundListing = await Car.findOne({ _id: id })
    if(!foundListing) return res.status(400).json({ message: `Listing with id ${req.params.id} not found`})

    const updatedListing = await Car.updateOne({ _id: id }, { sold: !foundListing.sold })

    console.log(updatedListing)

    return res.status(200).json({ message: `Sold status of ${foundListing.brand} changed`})
})


const filterResults = asyncHandler(async( req, res) => {
    const categories = ['suv', 'sedan', 'hatchback', 'crossover', 'bike', 'sports']
    const filter = req.query.q

    if(categories.includes(filter)){
        const carList = await Car.find({ category: filter })
        if(!carList) return res.status(204).json({ message: `No car listing of category ${filter}`});
        return res.status(200).json(carList)
    }

    if(filter == 'price'){
        const carList = await Car.find().sort('-price')
        if(!carList) return res.status(204).json({ message: `No car listing of category ${filter}`});
        return res.status(200).json(carList)
    }

    if(filter == 'date'){
        const carList = await Car.find().sort('-date')
        if(!carList) return res.status(204).json({ message: `No car listing of category ${filter}`});
        return res.status(200).json(carList)
    }

    res.status(400).json({ warning: `Wrong filter query`})
})


module.exports = {
    uploadNewCar,
    setCarSold,
    getAllSoldCars,
    getCar,
    deleteCar,
    updateCar,
    uploadImages,
    getAllCars,
    filterResults
}


