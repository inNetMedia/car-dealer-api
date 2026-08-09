const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config()
const express = require('express'),
    cors = require('cors'),
    PORT = 3500 || process.env.PORT,
    app = express(),
    connectDB = require('./config/dbConnect'),
    uploadImages = require('./services/cloudinaryService'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose');
    


connectDB()

app.use(cookieParser())

app.use(cors({
    origin: ['https://car-dealer-front-end.vercel.app'], 
    credentials: true 
}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', require('./routes/api'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/user', require('./routes/userRoutes'))


mongoose.connection.once('open', () => {
    console.log(`Connected to mongoDB...`)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
//app.listen(PORT, console.log(`Server running on port ${PORT}...`))