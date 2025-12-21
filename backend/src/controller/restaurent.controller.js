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
    const {restaurentId,restaurentName,offers,logo,contactInfo,clearOffers} = req.body ;
    const filter = {
      restaurentId 
    }
    const update = {

    }

    // if(!restaurentId){
    //   update.$set = {...update.$set,restaurentId : generateRestaurantId()}
    // }

    if(restaurentName){
      update.$set = {...update.$set,restaurentName}
    }
    if(offers){
      update.$push = {offers}
    }
    if(logo){
      update.$set = {...update.$set,logo}
    }
    if(contactInfo){
      update.$set = {...update.$set,contactInfo}
    }

    if(clearOffers){
      update.$set = { ...update.$set,offers : []}
    }

    const resto = await Table.findOneAndUpdate(filter,update,{new : true , runValidators : true , upsert : true});

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
      const resto = await Table.findOne({restaurentId : "REST-20251221-XGQIW9"});
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
  })
}