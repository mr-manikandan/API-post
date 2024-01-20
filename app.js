const express = require("express");
const app = express();
const mongoose = require("mongoose");
 require('dotenv').config()


app.use(express.json());
const postroute = require("./routes/post")
const BookRegister = require("./routes/Book")
const imageupload = require("./routes/image")

// mongoose.connect('mongodb+srv://mani:mani.3102@atlascluster.3pwuzq1.mongodb.net/practice')
mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('connected!.'));

app.use("/", postroute);
app.use("/",BookRegister);
app.use("/",imageupload);


const port = 3000;
app.listen(port,() => {
    console.log( `a Node js API is listening on port : ${port}` )

});
