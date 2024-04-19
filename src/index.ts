import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connect} from "./config/db.config"
import { getConnectionState, isValidConnectionURI } from "./config/db.config";

const app = express();

dotenv.config({
    path: ".env"
});


//environment variables
const PORT = process.env.PORT || 3975;
const MONGO_URI = process.env.CONNECTION_URI;

// Check MongoDB connection string format
if (!isValidConnectionURI(MONGO_URI as string)) {
    // tslint:disable-next-line:no-console
    console.log("Error: Invalid MongoDB Connection URI");
    process.exit(0);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.listen(PORT, async() => {

    if (typeof MONGO_URI === "undefined") {
        throw new Error("MONGO_URI is not defined");
    }

    const db = await connect(MONGO_URI);


    console.log(
        `${getConnectionState(db.connection.readyState)} to the database`
    );
    db.connection.once("open", () =>
        console.log("DB connection established.")
    );
    console.log(`Listening on locahost://${PORT}...`);

    app.emit("ready");
});

export {app};

