const mongoose = require("mongoose");
const Goods = require("./Models/WareHouseGoods"); // adjust path if needed

require("dotenv").config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const sampleGoods = [
  {
    name: "Wireless Mouse",
    category: "Electronics",
    description: "Ergonomic wireless mouse with USB receiver",
    price: 799,
    stock: 150,
    warehouseLocation: {
      type: "Point",
      coordinates: [77.5946, 12.9716]
    },
    image: "https://source.unsplash.com/featured/?mouse,electronics",
    isAvailable: true
  },
  {
    name: "Office Chair",
    category: "Furniture",
    description: "Comfortable mesh back chair with lumbar support",
    price: 4299,
    stock: 25,
    warehouseLocation: {
      type: "Point",
      coordinates: [77.1025, 28.7041]
    },
    image: "https://source.unsplash.com/featured/?chair,furniture",
    isAvailable: true
  },
  {
    name: "Notebook A5",
    category: "Stationery",
    description: "100-page ruled notebook",
    price: 55,
    stock: 300,
    warehouseLocation: {
      type: "Point",
      coordinates: [72.8777, 19.0760]
    },
    image: "https://source.unsplash.com/featured/?notebook,stationery",
    isAvailable: true
  },
  {
    name: "LED Desk Lamp",
    category: "Lighting",
    description: "Rechargeable LED desk lamp with adjustable brightness",
    price: 999,
    stock: 80,
    warehouseLocation: {
      type: "Point",
      coordinates: [88.3639, 22.5726]
    },
    image: "https://source.unsplash.com/featured/?lamp,light",
    isAvailable: true
  },
  {
    name: "USB-C Cable",
    category: "Accessories",
    description: "1m braided USB-C to USB-A cable",
    price: 199,
    stock: 500,
    warehouseLocation: {
      type: "Point",
      coordinates: [80.2707, 13.0827]
    },
    image: "https://source.unsplash.com/featured/?usb,cable",
    isAvailable: true
  }
];

const seedDB = async () => {
  await Goods.deleteMany({});
  await Goods.insertMany(sampleGoods);
  console.log("Database seeded with sample goods!");
  mongoose.connection.close();
};

seedDB();
