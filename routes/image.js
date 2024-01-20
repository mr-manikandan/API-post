const express = require("express");

const router = express.Router();
const {upload,imageupload} = require("../controlers/image");

router.post("/img", upload,imageupload);


module.exports = router;