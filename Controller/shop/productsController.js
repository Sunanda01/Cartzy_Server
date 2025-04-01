const Product=require('../../Models/Product');
const getFilteredProduct=async(req,res)=>{
    try{
        const products=await Product.find({});
        res.status(200).json({success:true,msg:"Products Fetched",data:products});
    }
    catch(err){
        console.error(err);
        res.status(500).json({success:false,msg:"Failed to fetch product"})
    }
}
module.exports={getFilteredProduct}