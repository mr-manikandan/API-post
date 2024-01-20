const mongoose = require("mongoose");

const postschema = new mongoose.Schema({

    tittle : {
        type : String
    },
    imagename :{
        type: String,
    }
    
});



 module.exports = mongoose.model("image", postschema);