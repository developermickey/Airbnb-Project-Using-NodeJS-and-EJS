const mongoose = require("mongoose");
const initData = require("./data")
const Listing = require("../models/listing");


const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
main()
.then(() => {
    console.log("Mongo database connected");
}) 
.catch(err => console.log(err));


async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "66b4c0e51e6e1c66e68adaf3"}))
   await Listing.insertMany(initData.data);
   console.log("Data Was Successfully Updated");
}

initDB();