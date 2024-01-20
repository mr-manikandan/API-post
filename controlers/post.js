const post = require("../models/post");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const multer = require("multer");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

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
 exports.upload = multer({ storage: storage }).fields([
    { name: 'fieldname', maxCount: 1 },
  ])

  //SEND EMAIL
    async function sendEmail(email, subject, message) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: `"Airvays"<kmanikandan3102@gmail.com>`,
      to: `kmainkandan3102@gmail.com,${email}`,
      subject: subject,
      html: message,
    });
}

//email send
  exports.createpost =async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const findUser = await post.findOne({ email: email });
    if (!findUser) {
      //create new user
      const newUser = await post.create(req.body);
      // send welcome email to new user
      const subject = "Welcome to Register!";
      const message = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #4258bf;text-decoration:none;font-weight:600">Thank you for choosing Platform</a>
        </div>
        <p style="font-size:1.1em">Hello ${email}</p>
        <p>Your account has been successfully registered. Please wait for our team to activate your account.</p>
        <h2 style="background: #4258bf;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"></h2>
        <p style="font-size:0.9em;">Regards,<br />Airvays team</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Private Technologies Pvt Ltd</p>
          <p>7 soon lee street, #02-45 ISPACE</p>
          <p>India</p>
        </div>
      </div>
    </div>`;
      sendEmail(email, subject, message);
      res.json(newUser);
    } else {
      // user already exists
      throw new Error("User Already Exists");
    }
  };

  async function sendEmailotp(email, subject, message){
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
      },
    });
    let info = await transporter.sendMailotp({
      from: `"Airvays"<kmanikandan3102@gmail.com>`,
      to: `kmainkandan3102@gmail.com,${email}`,
      subject: subject,
      html: message,
    });
}
     
  //send email otp
  exports.forgotpassword = async (req,res) => {
    const email =req.body.email;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false, specialChars: false 
     });
     const findUser = await post.findOne({ email});
    if (findUser) {
      const subject = "YOUR OTP IS"
      const message = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Brand Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
    </div>`
      res.status(201).json();
      sendEmailotp(email,subject,message);
    } else {
      // user already exists
      throw new Error("User Already Exists");
    }
};
  
  // SIGNIN
//      exports.createpost =async (req,res) => {
//    // const imagepath = req.files["fieldname"][0].path;
//     try{
//         const existingemail = await Post.findOne({ email: req.body.email});
//         if(existingemail){
//             return res.status(400).json({ message:"User already exists"});
//         }
//         const salt = await bcrypt.genSalt(5);
//         const hashedpassword = await bcrypt.hash(req.body.password, salt)
//         const newemail = await Post({
//             username : req.body.username,
//             email: req.body.email,
//             password: hashedpassword,
//             //imagefile : imagepath
//         });
//         await newemail.save();
//         res.status(201).json(newemail);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'internal server error. '})

//     } }

    //LOGIN POST
    exports.loginpost =async (req,res) => {  
        try{
            const {email,password} = req.body;
            const existinguser = await Post.findOne({email});
            if(!existinguser){
                return res.status(400).json({ message:"user not found"});
            }
            const comparepassword =  await bcrypt.compare(password,existinguser.password);
            if(!comparepassword){
                return res.status(400).json({ message:"password not valid"});
            }
            res.status(201).json({
                message:"user logged successfully",
                data : existinguser
      }); 
        }
        catch(err){
            console.log(err);
            res.status(500).json({error: 'internal server error. '})
        } }

    //GETUSER
    exports.getposts =async (req,res) => {
            const {id} = req.params;
        try{
            const foundID =await post.findById(id);
        if(!foundID){
            return res.status(400).json({message:"ID is not found"});
        }
        res.status(201).json({
            message: "ID founded successfully",
            data : foundID
        })
     }
     catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error. '})
      } }

    //UPDATE USER
   exports.updatepost =async (req,res) => {
        const {id} = req.params;
        const update = req.body;
    try{
        const UpdateID =await post.findByIdAndUpdate(id,update,{new : true});
    if(!UpdateID){
        return res.status(400).json({message:"Updated failed"});
    }
    res.status(201).json({
        message: "ID Updated successfully",
        data : UpdateID
    })
    }
    catch(err){
    console.log(err);
    res.status(500).json({error: 'internal server error. '})
   }}
    
   //DELETE USER
    exports.Deleteposts =async (req,res) => {
        const {id} = req.params;
    try{
        const DeleteID =await post.findByIdAndDelete(id);
    if(!DeleteID){
         return res.status(400).json({message:"ID is not deleted"});
    }
    res.status(201).json({
         message: "ID is Deleted",
        data : DeleteID
    })
    }catch(err){
    console.log(err);
    res.status(500).json({error: 'internal server error. '})
  }}