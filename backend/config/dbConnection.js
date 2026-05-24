const mongoose = require("mongoose");

const connectDB = async () => {
    const connectionString = process.env.CONNECTION_STRING;
    const connect = await mongoose.connect(connectionString);
    console.log(
        "Database connected",
        connect.connection.host,
        connect.connection.name
    );
};

module.exports = connectDB;