const { uploadImage } = require('../services/imagekit.service');
const productModel = require('../db/models/product.model');
const { default: mongoose } = require('mongoose');
const { publishToQueue} = require('../broker/broker')

async function createProduct(req, res) {
  try {
    const { title, category, priceAmount, priceCurrency = 'INR', quantity, description, harvestDate, shelfLifeDays, location } = req.body;
    
    if (!title || !category || priceAmount==null || quantity==null || !harvestDate || !shelfLifeDays || !location || !req.file) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    
    const parsedLocation = JSON.parse(location);

   
    const farmerId = req.user.id;

    
    const harvest = new Date(harvestDate);
    const expiryDate = new Date(harvest);
    expiryDate.setDate(expiryDate.getDate() + Number(shelfLifeDays));

    const imageUploadResult = await uploadImage(req.file);

    const image = {
      url: imageUploadResult.url,
      thumbnail: imageUploadResult.thumbnailUrl,
      id: imageUploadResult.fileId
    }

    const product = await productModel.create({
      title,
      category,
      image,
      price: 
      { 
        amount: Number(priceAmount), 
        currency: priceCurrency 
      },
      quantity: Number(quantity),
      description,
      harvestDate : harvest,
      expiryDate,
      farmerId,
      location: parsedLocation
    });

    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED', product);

    res.status(201).json({ 
      message: "Product created successfully",
      product
    });

  }

  catch (error) {
    res.status(500).json({  message: "Internal server error" });
  }

}

async function getProducts(req, res) {
  try {
    const { q, category, minPrice, maxPrice, lat, lng, radius = 10, skip = 0, limit = 20 } = req.query;

    const filter = {}

    if(q)
    {
      filter.$text = { $search: q };
    }

   const categories = Array.isArray(category)
  ? category
  : category?.split(",");

    if (categories?.length) {
  filter.category = { $in: categories };
}

    if(minPrice)
    {
      filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minPrice) };
    }

    if(maxPrice)
    {
      filter['price.amount'] = { ...filter['price.amount'], $lte: Number(maxPrice) };
    }

   if (lat && lng ) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)]
        },
        $maxDistance: Number(radius)*1000
      }
    };
   }

  const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit),20));

  res.status(200).json({
    message: "Products retrieved successfully",
    products
  });
  }
  catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getProductById(req, res)
{
   try {
     const { id } = req.params;

     const product = await productModel.findById(id);

     if(!product)
     {
        return res.status(404).json({
          message : "Product not found"
        })
     }
    

    res.status(200).json({
      message: "Product fetched successfully",
      product : product
     })
   }
   catch (error) {
     res.status(500).json({ message: "Internal server error" });
   }
}

async function updateProduct(req, res)
{
   try {
   const { id } = req.params;

   if(!mongoose.Types.ObjectId.isValid(id))
   {
     return res.status(400).json ({
      message: "Invalid product id",
     })
   }

   const product = await productModel.findOne({
    _id: id,
    farmerId: req.user.id
   });

   if(!product)
   {
       return res.status(404).json({
          message : "Product not found"
        })
   }


   const {
  title,
  category,
  quantity,
  description,
  price
  } = req.body;



   if (title !== undefined) product.title = title;

   if (category !== undefined) product.category = category;

   if (quantity !== undefined) product.quantity = quantity;

   if (description !== undefined) product.description = description;

   if (price !== undefined) {
  product.price.amount = price;
  }


   await product.save();

   await publishToQueue('UPDATE_PRODUCT', product);

   res.status(200).json({
     message: "Product updated successfully",
     product: product
   })

}
catch (error) {
     res.status(500).json({ message: "Internal server error" });
   }   


}

async function deleteProduct(req,res)
{
   try {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
   {
     return res.status(400).json ({
      message: "Invalid product id",
     })
   }
   

   const product = await productModel.findById(id);

   if(!product)
   {
       return res.status(404).json({
          message : "Product not found"
        })
   }

   if(product.farmerId.toString() !== req.user.id)
   {
      return res.status(403).json({
        message : "Forbidden: You can only delete your own product"
      })
   }


   await product.deleteOne();
    
   res.status(200).json({
    message: "Product deleted successfully"
   })
    
   } catch (error) {
     res.status(500).json({ message: "Internal server error" });
   }
}

async function getProductsByFarmer(req,res)
{
       const farmer = req.user;

       const { skip = "0", limit = "20" } = req.query;

       const products = await productModel.find({farmerId: farmer.id}).skip(Number(skip)).limit(Math.min(Number(limit),20));

       return res.status(200).json({
         products: products
       });
}


async function updateProductQuantity(req,res)
{
   //console.log(req.params.id, req.body.quantity, "=====================");

   const product =  await productModel.findByIdAndUpdate(
    req.params.id,
    {
        $inc: {
            quantity: -req.body.quantity
        }
    },
    {
      new: true
    }
   );

   await publishToQueue('UPDATE_PRODUCT', product);

   res.status(200).json({
    message: "Product quantity updated successfully"
   })

}



module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByFarmer, updateProductQuantity };
