const post = require("../models/Book");
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
 exports.upload = multer({ storage: storage }).fields([
    { name: 'fieldname', maxCount: 1 },
  ])

  // create 
exports.createpost =async (req,res) => {
    const imagepath = req.files["fieldname"][0].path;
    try{
        const  RegisterBooks= await post.findOne({ Bookname: req.body.Bookname});
        if(RegisterBooks){
            return res.status(400).json({ message:"The Book is Registerd"});
        }
        const NewBook = await post({
            Bookname : req.body.Bookname,
            Authername: req.body.Authername,
            Description: req.body.Description,
            Price : req.body.Price,
            image : imagepath
        });
        await NewBook.save();
        res.status(201).json(NewBook);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error. '})

    } }

    //post
    exports.postfind =async (req,res) => {
        
        try{
              const {Bookname} = req.body;
              const Booksfind = await Post.findOne({Bookname});
          if(!Booksfind){
         return res.status(400).json({ message:"The Book is Not Resgiterd"});
           }
          const FindBookname =  await bcrypt.compare(Bookname, Booksfind.Bookname);
          res.status(201).json({
               message:"The Book is Finded Successfully",
               data : Booksfind
         });
     }
        catch(err){
            console.log(err);
            res.status(500).json({error: 'internal server error. '})
    
        } }
        
        //update 
        exports.updateBook =async (req,res) => {
            const {id} = req.params;
            const {Price,Description} = req.body;
        try{
            const Updateprice =await post.findByIdAndUpdate(id,{Price,Description},{new : true});
        if(!Updateprice){
            return res.status(400).json({message:"Updated failed"});
        }
        res.status(201).json({
            message: "Price Updated successfully",
            data : Updateprice
        });
        }
        catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error. '})
       }}

       //delete
       exports.DeleteBook =async (req,res) => {
        const {id} = req.params;
        try{
        const DeleteID =await post.findByIdAndDelete(id);
        if(!DeleteID){
        return res.status(400).json({message:"Book ID id not deleted"});
        }
        res.status(201).json({
        message: "Book ID is Deleted",
        data : DeleteID
        })
        }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error. '})
      }}


    

    