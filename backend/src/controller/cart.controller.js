const catchAsync = require('../utils/catchAsync.js');
const User = require('../model/users.model.js');

module.exports = {
  getCartItems : catchAsync(async(req,res)=>{
    const {_id} = req.user ;
    const user = await User.findOne({_id}).populate("cart.item")
    if(!user)throw new AppError("User Not Found!",404);

    res.status(200).json(user.cart);
  }),

  addItemsToCart : catchAsync(async(req,res)=>{
    const {id} = req.params ;
    const {_id} = req.user ;

    const update = await User.findOneAndUpdate({_id,"cart.item" : id},{$inc :{"cart.$.quantity" : 1}},{new : true}).populate("cart.item");
    if(update)return res.status(200).json({message : "quantity updated!",status : 200,cart : update.cart});

    const user = await User.findOneAndUpdate({_id},{$push : {cart : {item : id,quantity : 1}}},{new : true}).populate("cart.item");
    if(!user)throw new AppError("Item cannot be added!",400);

    res.status(201).json({
      message : "Item Added to Cart!",
      status : 201,
      cart : user.cart
    })
  }),

  removeItemFromCart : catchAsync(async(req,res)=>{
    const {id} = req.params ;
    const {_id} = req.user ;

    const update = await User.findOneAndUpdate({_id,"cart.item" : id,"cart.quantity":{$gt : 1}},{$inc : {"cart.$.quantity" : -1}},{new : true}).populate("cart.item");

    if(!update){
      const update = await User.findOneAndUpdate({_id , "cart.item" : id},{$pull : {cart : {item : id}}},{new :true}).populate("cart.item");
      
      return res.status(200).json({
        message : "item Deleted Successfully!",
        cart : update.cart,
        status : 200
      })
    }

    res.status(200).json({
      message : "Item quantity Decreased",
      cart : update.cart 
    })
  // }),

  // emptyCart : catchAsync(async(req,res)=>{
  //   const {_id} = req.user ;
  //   const user = await User.findOneAndUpdate({_id},{$set : {cart : []}},{new : true});
  //   if(!user)throw new AppError("User Not Found!",404);
  //   res.status(200).json({
  //     message : "User Cart Cleared!",
  //     cart : user.cart,
  //     status : 200
  //   })
 })
}