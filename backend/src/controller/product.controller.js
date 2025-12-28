const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const Item = require('../model/items.model.js');

module.exports = {
  getItems : catchAsync(async (req,res)=>{
    const {q,category} = req.query ;
    const filter = {
      isRemoved : false
    }

    if(q?.trim()){
      filter.name = {$regex : q.trim() , $options : "i"}
    }

    if(category){
      filter.category = category
    }

    const items = await Item.find(filter);

    console.log(q,items)

    res.status(200).json(items);

  }),

  getItemsCategory : catchAsync(async(req,res)=>{
    const {c} = req.query ;
    const match = {$match : {isRemoved : false}}
    if(c){
      match.$match.category = c
    }

    const items = await Item.aggregate([
      match,
      {$group : {
        _id : "$category",
        items : {
          $push : {
            _id : "$_id",
            name : "$name",
            price : "$price",
            image : "$image",
            category : "$category",
            rating : "$rating",
            isAvailable : "$isAvailable",
            isSpecial : "$isSpecial",
            isBest : "$isBest",

            }
          }
        }
      },
      {$project : {
        _id: 0,
        category: "$_id",
        items: 1
      }},
      {
        $sort : {
          category : 1
        }
      }
    ])
    if(!items)throw new AppError("items cannot be accessble!",400);
    res.status(200).json(items)
  }),

  addItem : catchAsync(async (req,res)=>{
    const {name , price ,image,category,isSpecial ,isBest} = req.body ;
    if(!name || !price || !image || !category)throw new AppError("fields Required!",400);

    const item = await Item.create({
      name,
      price,
      image,
      category,
      isSpecial,
      isBest
    });

    res.status(201).json({
      message : "Product created Successfully!",
      item,
      status : 201
    });
  }),
  removeItem : catchAsync(async(req,res)=>{
    const {id} = req.params ;
    const deleted = await Item.deleteOne({_id : id});
    if(!deleted.deletedCount)throw new AppError("Item Can't be removed!",400);

    res.status(200).json({
      message : "product deleted successfully",
      status : 200
    });
  }),
  editItem : catchAsync(async(req,res)=>{
    const {name , price ,image,category,isAvailable,isRemoved , isSpecial ,isBest} = req.body ;
    const {id} = req.params ;

    if(!name || !price || !image || !category || !isAvailable || !isRemoved || !isSpecial || !isBest)throw new AppError("Field Required!",400);
    const update = await Item.findByIdAndUpdate({_id : id },{
      name,
      price,
      image,
      category,
      isAvailable,
      isRemoved,
      isSpecial,
      isBest
    },{new : true , runValidators : true});
    
    if(!update)throw new AppError("Updation failed!",405);

    res.status(200).json({
      message : "product updated!",
      status : 200
    })
  }),

  changeAvailability : catchAsync(async(req,res)=>{
    const isAvailable = req.query?.available ;
    if(!isAvailable)throw new AppError("availablity query required!",400);
    console.log(isAvailable);
    const {id} = req.params;

    const update = await Item.findByIdAndUpdate({_id : id },{isAvailable},{new : true , runValidators : true});
    if(!update)throw new AppError("Updation failed!",405);

    res.status(200).json({
      message : `Item ${update.isAvailable ? "available" : "not available"}!`,
      status : 200
    });
  })  

}