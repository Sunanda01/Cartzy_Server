const { imageUploadUtil } = require("../../Middleware/cloudinary");

const handleImageUpload=async(req,res)=>{
    try{
        const b64=Buffer.from(req.file.buffer).toString("base64");
        const url="data:"+req.file.mimetype+";base64,"+b64;
        const result=await imageUploadUtil(url);
        res.json({success:true,result});
    }
    catch(err){
        console.error(err);
        res.json({success:false,msg:"Error Occurred"});
    }
}
module.exports={handleImageUpload};