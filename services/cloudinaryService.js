const cloudinary = require('cloudinary').v2

const uploadImages = () => {
    console.log(cloudinary.config().cloud_name)
}

module.exports = uploadImages
