var express = require('express');
var router = express.Router();
var fs = require('fs-extra');

//==============
//Get Product Model
//=============
var Product = require('../models/product');
//==============
//Get Category Model
//=============
var Category = require('../models/category');

//Get all products

router.get('/',function(req,res){
    //res.send('working on my project yo!!!');
    product.find(function(err,products){
        if(err){
            console.log(err);
        }
       
            res.render('all_products',{
                title: 'All products',
                content: products
            });

       
    });
    
});

//Get products by category

router.get('/:category',function(req,res){
    //res.send('working on my project yo!!!');
    var categorySlug = req.params.Category;
    Category.findOne({slug:categorySlug},function(err,c){
        product.find({Category:categorySlug},function(err,products){
            if(err){
                console.log(err);
            }
           
                res.render('cat_products',{
                    title: c.title,
                    content: products
                });
    
           
        });

    });
   
    
});

//Get product details

router.get('/:category/:product',function(req,res){
    
    var galleryImages =null;
    Product.findOne({slug: req.params.product},function(err,product){
        if(err){
            console.log(err);
        }else{
            var galleryDir = 'public/product_images/' +product._id +'/gallery';
            fs.readdir(galleryDir,function(err,files){
                if(err){
                    console.log(err);
                }else{
                    galleryImages = files;
                    res.render('product',{
                        title: Product.title,
                        p: Product,
                        galleryImages: galleryImages
                    })
                }
            });
        }

    });
    
});



//Exports
module.exports = router;