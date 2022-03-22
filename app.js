const express = require("express");
const mongoose = require("mongoose");
const ATLAS_URI = require("./config");
const app = express();
const port = process.env.PORT || 3001
const route = require("./routes/route");

mongoose.connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("error", () => {
    console.log("Error while connecting to the database");
});

db.once('open', () => {
    console.log("Database connected");
});

app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use("/", route);
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log("App is listening on port " + port);
});

module.exports = app;