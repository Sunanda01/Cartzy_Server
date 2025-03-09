const mongoose=require('mongoose');
const DATABASE_LINK=require('../Config/config').DATABASE_LINK;
const connection=async()=>{
    try{
        await mongoose.connect(DATABASE_LINK);
        console.log("Database Connected Successfully");
    }
    catch(err){
        console.error(err);
    }
}
module.exports=connection;