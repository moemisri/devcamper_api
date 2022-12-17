const mongoose = require("mongoose");
const colors = require("colors");
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true,
  });
  console.log(
    `MongoDB Connected: ${conn.connection.host}`.yellow.underline.bold
  );
};
module.exports = connectDB;
