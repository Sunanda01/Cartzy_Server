const cloudinary=require('cloudinary').v2;
const multer=require('multer');
const CLOUDNAME=require('../Config/config').CLOUDNAME;
const APIKEY=require('../Config/config').APIKEY;
const APISECRETKEY=require('../Config/config').APISECRETKEY;

cloudinary.config({
    cloud_name:CLOUDNAME,
    api_key:APIKEY,
    api_secret:APISECRETKEY
})

const storage=new multer.memoryStorage();
async function imageUploadUtil(file) {
    const result=await cloudinary.uploader.upload(file,{resource_type:"auto"});
    return result;
}
const upload=multer({storage});
module.exports={upload,imageUploadUtil};