const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mitheleshnaikds_db_user:YFSAkBMr1NgA1CRj@cluster0.bzdreod.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); 
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
