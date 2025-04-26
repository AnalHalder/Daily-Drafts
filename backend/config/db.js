const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(console.log('mongodb connected'))
        .catch((error) => console.log(error))
}

module.exports = connectDB