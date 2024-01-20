const post = require("../models/image")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split(".").pop();
        // Combine the original name, current timestamp, and extension to create the filename
        const filename = file.originalname + "-" + Date.now() + "." + fileExtension;
    
        cb(null, filename);
    }
  })
  
   const upload = multer({ storage: storage }).fields([
    { name: 'fieldname', maxCount: 1 },
  ])
  exports.upload = upload;

exports.imageupload = async(req,res) => {
        const imagepath = req.files["fieldname"][0].path;
    try{
        const img =await post({
            imagename : imagepath
        })
        await img.save();
        res.status(201).json(img);

    }catch(err){

        console.log(err);
        res.status(500).json({error: 'internal server error. '})
    }

}

