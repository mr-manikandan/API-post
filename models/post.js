const mongoose = require("mongoose");


 const postschema = new mongoose.Schema({
    tittle : {
        type : String
 },
    username:{
        type: String
    },
    email:{
        type:String
    },
    password :{
        type: String
    },
    imagefile:{
        type : String
    },
    body : {
        type:String,
 }

});

module.exports = mongoose.model("user", postschema);