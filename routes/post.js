const express = require("express")
const {createpost, getposts, updatepost, Deleteposts, loginpost, forgotpassword} = require("../controlers/post");

const router = express.Router();

router.post("/signin",createpost);
router.post("/login", loginpost);
router.post("/otp",forgotpassword);
router.get("/:id",getposts)
router.put("/update/:id", updatepost);
router.delete("/:id",Deleteposts);



module.exports = router;