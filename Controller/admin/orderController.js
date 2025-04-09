const Order=require('../../Models/Order');
const getAllOrder=async(req,res)=>{
    try{
      const order=await Order.find();
      if(!order) return res.status(404).json({success:false,msg:"No Orders Found"});
       res.status(200).json({success:true,msg:"Orders Found",data:order});
    }catch(err){
       res.status(500).json({success:false,msg:"Failed to fetch order"});
    }
    
  }

const getOrderDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          msg: "Order not found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        msg: "Some error occured!",
      });
    }
  };

  const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          msg: "Order not found!",
        })
    }
      await Order.findByIdAndUpdate(id, { orderStatus });
      res.status(200).json({
        success: true,
        msg: "Order status is updated successfully!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
  module.exports={getAllOrder,getOrderDetails,updateOrderStatus}