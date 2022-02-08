const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require("./routes/auth")

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(
    process.env.MONGO_URL)
    .then(()=> console.log("DB"))
    .catch((err)=>{
        console.log(err)
    });

    app.use("/api/auth",authRoute);



app.listen(process.env.PORT || 5000,() => {
    console.log("connecting to db ",process.env.PORT);
})