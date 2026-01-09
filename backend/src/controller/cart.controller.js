const catchAsync = require('../utils/catchAsync.js');
const User = require('../model/users.model.js');
const Item = require('../model/items.model.js');
const AppError = require('../utils/AppError.js');

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

    const item = await Item.findOne({_id : id , isAvailable : false});
    if(item)throw new AppError("Item Can't be added!",400);
    
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

  removeItemFromCart: catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const update = await User.findOneAndUpdate(
    {
      _id,
      cart: {
        $elemMatch: {
          item: id,
          quantity: { $gt: 1 }
        }
      }
    },
    { $inc: { "cart.$.quantity": -1 } },
    { new: true }
  ).populate("cart.item");

  if (update) {
    return res.status(200).json({
      message: "Quantity decreased",
      cart: update.cart
    });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id },
    { $pull: { cart: { item: id } } },
    { new: true }
  ).populate("cart.item");

  res.status(200).json({
    message: "Item removed",
    cart: updatedUser.cart
  });
})

}