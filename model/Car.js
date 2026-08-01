const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const CarSchema = new Schema({
    listingDate:{
        type: Date,
        default: Date.now()
    },
    images: {
        type: Array,
        required: true
    },
    brand: {
        type: String, 
        required: true
    },
    category:{
        type: String,
        required: true
    },
    model: {
        type: String, 
        required: true 
    },
    variant:{
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true 
    },
    price: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    featured: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    description: {
        type: String,
        required: true
    },
    features:{ type: Array, required: true },
    sold: { type: Boolean, default: false },
    specs: {
        transmission: {
            type: String,
            required: true
        },
        engine: {
            acceleration: Number,
            emmisions: Number,
            position: String,
            size: Number,
            capacity: Number,
            cylinderLayout: String,
            maxPower: Number,
            fuelType: {
                type: String,
                required:true
            },
            fuelCapacity: {
                type: Number,
                required: true
            },
            fuelConsumption: {
                type: Number,
                required: true
            },
            range: Number,
            torque: Number,
        },
        handling:{
            powerSteering: String,
            tractionCtrl: String,
            driveTrain: { type: String, required: true },
        },
        comfort:{
            AC: Boolean,
            electricWindows: Boolean,
            seats: {
                type: Number,
                required: true
            },
            doors: {
                type: Number,
                required: true
            }
        },
        tech:{
            steeringWheelCtrl: Boolean,
            onboardPC: Boolean,
            bluetooth: Boolean,
            USBport: Boolean,
            infotainment: Boolean
        },
        safety:{
            airbagQty: Number,
            ISOFIX: String,
            ABS: Boolean,
            cruiseCtrl: Boolean,
            remoteCentralLocking: Boolean,
            lampTech: String
        }
    }
})

module.exports = mongoose.model('Car', CarSchema)