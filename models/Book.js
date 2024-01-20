const mongoose = require("mongoose");


 const postschema = new mongoose.Schema({
    tittle : {
        type : String
    },
    Bookname:{
        type: String
    },
    Authername:{
        type:String
    },
    Description:{
        type: String
    },
    Price :{
        type:String
     },
    image :{
        type:String
    },
     body : {
        type:String,
 }

});

module.exports = mongoose.model("Book", postschema);