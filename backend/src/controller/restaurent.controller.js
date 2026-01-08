const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const Table = require('../model/table.model.js');
const Item = require('../model/items.model.js');

function generateRestaurantId() {
  const prefix = "REST";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${date}-${random}`;
}

module.exports = {

  updateRestoSettings : catchAsync(async (req,res)=>{
    const {logo,phone,email,location,restaurentTimes,status} = req.body ;

    if(!["open","closed"].includes(status))throw new AppError("status Not Allowed",400);

    const query = {
      $set : {}
    }

    if (logo) query.$set.logo = logo;
    if (phone) query.$set.phone = phone;
    if (email) query.$set.email = email;
    if (location) query.$set.location = location;
    if (restaurentTimes) query.$set.restaurentTimes = restaurentTimes;
    if(status) query.$set.status = status ;

    if (Object.keys(query.$set).length === 0) {
      throw new AppError("No fields to update", 400);
    }

    const resto = await Table.findOneAndUpdate({restaurentId : "REST-20251221-XGQIW9"},query,{new : true , runValidators : true});

    if(!resto)throw new AppError("Restaurent Settings Updation Failed!",400);

    res.status(201).json({
      message : "Updated!",
      status : 201,
      resto
    })
  }),

  getWebsiteData : catchAsync(async(req,res)=>{
    const {settings,best,special} = req.query ;
    const data = {}

    if(settings){
      const resto = await Table.findOne({restaurentId : "REST-20251221-XGQIW9"}).populate('offers.product')
      data.settings = resto ;
    }

    if(best){
      const items = await Item.find({isBest : true});
      data.bestSelling = items ;
    }

    if(special){
      const items = await Item.find({isSpecial : true});
      data.specialItems = items ;
    }

    res.status(200).json({
      message : "Data Found!",
      ...data
    })
  }),

  createOffer : catchAsync ( async (req,res)=>{
    const {title,offer,product,isMain} = req.body ;
    if(!title || !offer || !product)throw new AppError("Field Required!",400);

    if(isMain){
      await Table.findOneAndUpdate({restaurentId : "REST-20251221-XGQIW9"},{$pull : {offers : {isMain : true}}})
    }
    
    const resto = await Table.findOneAndUpdate({restaurentId : "REST-20251221-XGQIW9"},{$push : {
      offers : {
        isMain,
        product,
        offer,
        title
      }
    } });

    res.status(201).json({
      message : "Offer created Successfully!",
      resto
    })
  }),

  removeOffer : catchAsync (async (req,res)=>{
    const {id} = req.params  ;
    if(!id)throw new AppError("need offer id",400);
    await Table.findOneAndUpdate({restaurentId : "REST-20251221-XGQIW9"},{$pull : {offers : {_id : id}}});
    res.status(200).json({
      message : "offer Deleted successfully"
    })
  })

}