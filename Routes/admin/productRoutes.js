const {handleImageUpload} = require('../../Controller/productController/handleImage');
const { upload } = require('../../Middleware/cloudinary');
const router=require('express').Router();
router.post('/upload-image',upload.single('my_file'),handleImageUpload);
module.exports=router;