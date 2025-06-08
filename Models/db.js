const mongoose = require('mongoose'); 
const dotenv = require('dotenv'); 

dotenv.config(); 

const mongoURL = process.env.MONGO_URL ; 


mongoose.connect(mongoURL)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
