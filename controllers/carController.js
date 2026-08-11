const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2
const Car = require('../model/Car');


const uploadNewCar = asyncHandler( async(req, res) => {
    if(!req.body) return res.status(400).json({ message: `All fields are required` });

    const featuresArr = req.body.features.split(',')

    //Save everything to the DB
    const uploadedCar = await Car.create({
        model: req.body.model,
        images: req.body.images,
        variant: req.body.variant,
        year: req.body.year,
        price: req.body.price,
        description: req.body.description,
        features: featuresArr,
        brand: req.body.brand,
        mileage: req.body.mileage,
        category: req.body.category,
        featured: req.body.featured,
        latest: req.body.latest,
        specs:{
            transmission: req.body.transmission,
            engine: {
                maxPower: req.body.maxPower,
                acceleration: req.body.acceleration,
                size: req.body.size,
                position: req.body.position,
                emmisions: req.body.emmisions,
                capacity: req.body.capacity,
                cylinderLayout: req.body.cylinderLayout,
                fuelType: req.body.fuelType,
                fuelCapacity: req.body.fuelCapacity,
                fuelConsumption: req.body.fuelConsumption,
                range: req.body.range,
                torque: req.body.torque
            },
            handling: {
                powerSteering: req.body.powerSteering,
                tractionCtrl: req.body.tractionCtrl,
                driveTrain: req.body.driveTrain
            },
            comfort: {
                AC: req.body.AC,
                electricWindows: req.body.electricWindows,
                seats: req.body.seats,
                doors: req.body.doors
            },
            tech: {
                steeringWheelCtrl: req.body.steeringWheelCtrl,
                onboardPC: req.body.onboardPC,
                bluetooth: req.body.bluetooth,
                USBport: req.body.USBport
            },
            safety: {
                airbagQty: req.body.airbagQty,
                ISOFIX: req.body.ISOFIX,
                ABS: req.body.ABS,
                cruiseCtrl: req.body.cruiseCtrl,
                remoteCentralLocking: req.body.remoteCentralLocking,
                lampTech: req.body.lampTech
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

    return res.status(200).json({ "images": uploadedUrls })
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

    const updatedObj = { ...req.body }

    if (req?.body?.features) {
        updatedObj.features = Array.isArray(req.body.features)
            ? req.body.features
            : req.body.features.split(',')
    }

    const updatedListing = await Car.updateOne({ _id: req.params.id }, updatedObj)

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
    const cars = await Car.find({ sold: false }).sort({ listingDate: -1 })
    if(!cars || cars.length === 0) return res.status(204).json({ message: `There are currently no car listings`});

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
    const categories = ['SUV', 'Sedan', 'Hatchback', 'Crossover', 'Bike', 'Sports', 'Luxury', 'all', 'Bakkie']
    let filter = req.query.q

    if(categories.includes(filter)){
        if(filter === 'all'){
            const carList = await Car.find({ sold: false })
            if(!carList) return res.status(204).json({ message: `No car listing`});
            return res.status(200).json(carList)
        }

        const carList = await Car.find({ category: filter, sold: false })
        if(!carList) return res.status(204).json({ message: `No car listing of category ${filter}`});
        return res.status(200).json(carList)
    }

    if(filter.startsWith('d')){
        let fltrArr = filter.split('')
        fltrArr[0] = '-'
        filter = "".concat(...fltrArr)
        console.log(filter)
    }
    
    const carList = await Car.find({ sold: false }).sort(filter)
    if(!carList) return res.status(204).json({ message: `No car listing of category ${filter}`});
    return res.status(200).json(carList)

  

    //res.status(400).json({ warning: `Wrong filter query`})
})


const searchCars = asyncHandler( async(req, res) => {
    const search = req.query.q
    if(!search.length) return res.json([])

    // 1. Base condition: EXCLUDE sold cars unconditionally
    let query = { sold: { $ne: true } }; // handles both sold: false and undefined

    // 2. If a search term exists, append the $or conditions
    if (search && search.trim() !== '') {
      const term = search.trim();
      const regex = new RegExp(term, 'i'); // 'i' = case-insensitive partial match

      const searchConditions = [
        { brand: regex },        // e.g. "Volkswagen", "Mercedes"
        { model: regex },        // e.g. "Polo", "C-Class"
        { category: regex },     // e.g. "Hatchback", "SUV"
        { variant: regex },      // e.g. "1.0TSI", "AMG Line" (if you have this field)
      ];

      // Optional: If the user typed a number (like "2024"), match the numeric year too
      if (!isNaN(term)) {
        searchConditions.push({ year: Number(term) });
      }

      // Attach the $or array to the query
      query.$or = searchConditions;
    }

    const cars = await Car.find(query);
    res.json(cars);
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
    filterResults,
    searchCars
}


