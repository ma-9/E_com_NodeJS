var router = require('express').Router();
var Product = require('../models/products');
var Cart = require('../models/cart');


/* GET home page. */
router.get('/', async (req, res, next)=> {
  const response = await Product.find();
  res.render('shop/index', { title: 'DreamWorld' ,response});
});

router.post('/',async (req,res,next)=>{
  const { productImageUrl,name,desc,price } = req.body;
  
  const response = await new Product({
    imagePath:productImageUrl,
    name,
    desc,
    price,
  }).save();  
  console.log(response);
  res.redirect('/admin')
});

//  Update Route
router.post('/admin',async (req,res,next)=>{
  const { _id,updatedImagePath,updatedName,updatedDesc,updatedPrice } = req.body;
  const response = await Product.update(
      {_id},
      {$set:
        {
          imagePath:updatedImagePath,
          name:updatedName,
          desc:updatedDesc,
          price:updatedPrice
        }
      }
    )
    console.log(response)
  res.redirect('/admin');
})

router.get('/admin',async(req,res,next)=>{
  const allProducts = await Product.find();
  const sizeOfAllProducts = allProducts.length;
  if(sizeOfAllProducts > 0){
    result = true;
  }else{
    result = false;
  }
  res.render('admin',{title: 'Admin-DreamWorld',allProducts,result})
})

router.get('/delete/:_id',async(req,res,next)=>{
  const {_id} = req.params;
  const response = await Product.findOneAndDelete({_id});
  console.log(response);
  res.redirect('/admin')
})

// router.get('/delete/:name',async (req,res,next)=>{
//   const {name} = req.params;
//   const response = await Product.find({name});
//   if(response.length>0){
//     const deletedProducts = await Product.deleteMany({name});
//     console.log(deletedProducts);
//   }
//   res.redirect('/');
// });

router.get('/deleteAllProduct',async(req,res,next)=>{
  const response = await Product.deleteMany()
  res.redirect('/admin')
})


router.get('/add-to-cart/:_id',async(req,res,next)=>{
  const productID = req.params._id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  await Product.findById(productID,(err,product)=>{
    if(err){
      res.redirect('/');
    }
    cart.add(product, product._id,product.name);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })  
})

router.get('/shopping-cart',(req,res,next)=>{
  if (!req.session.cart) {
    return res.render('shop/shopping-cart',{products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products: cart.generateArray(),totalPrice: cart.totalPrice});
})

module.exports = router;
