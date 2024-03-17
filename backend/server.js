const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
// const flash = require('express-flash');
var cors = require('cors')


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
// app.use(flash());
app.use(express.json());
app.use(cookieParser());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

// Connect to the database
connectDB()
  .then(() => {
    // Start the server only after the database connection is established
    app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });