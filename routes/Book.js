const express = require("express");
const {createpost,postfind, updateBook, DeleteBook,upload} = require("../controlers/Book");

const router = express.Router();

router.post("/postbook", upload,createpost);
router.post("/postfinding", postfind );
router.put("/updating/:id", updateBook);
router.delete("/:id",DeleteBook);



module.exports = router;