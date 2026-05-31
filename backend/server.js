const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const validateEnv = require("./config/validateEnv");

dotenv.config();

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/contacts", require("./routes/contactRoutes"));
  app.use("/api/users", require("./routes/userRoutes"));
  app.use(errorHandler);

  return app;
};

const app = createApp();

const startServer = async () => {
  try {
    validateEnv();
    const PORT = process.env.PORT;

    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server startup failed:", err.message);
      process.exit(1);
    });

    return server;
  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, createApp, startServer };
