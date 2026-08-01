require('dotenv').config()
const express = require('express'),
    cors = require('cors'),
    PORT = 3500 || process.env.PORT,
    app = express(),
    connectDB = require('./config/dbConnect'),
    uploadImages = require('./services/cloudinaryService');


connectDB()

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', require('./routes/api'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/user', require('./routes/userRoutes'))


app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))