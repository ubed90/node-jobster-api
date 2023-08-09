require("dotenv").config({ path: './config/.env' });

const MOCK_DATA = require("./MOCK_DATA.json");

const Job = require("./models/Job");
const connectDB = require("./db/connect");


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Job.create(MOCK_DATA);
        console.log("DB Populated!!");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();