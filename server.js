const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");
//load env vars
dotenv.config({ path: "./config/config.env" });
// connect to database
connectDB();
// Body parser

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// const logger = require("./middleware/logger");
// app.use(logger);
app.use(cookieParser());
app.use(fileupload());

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`${process.env.NODE_ENV} mode, port ${PORT}`.yellow.bold)
);
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  server.close(() => process.exit(1));
});
