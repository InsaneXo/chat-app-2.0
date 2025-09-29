import mongoose from "mongoose";
const DB_NAME = "ConnectWaveDb"
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`

mongoose
    .connect(DB_URL, {
        dbName:DB_NAME,
        autoIndex: true,
    })
    .then((status) => console.info(`Connection establised to ${DB_NAME}`))
    .catch((err) =>
        console.error(`Could not connect to database: ${err.message}`)
    );
