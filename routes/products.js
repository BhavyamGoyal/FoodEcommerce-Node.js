var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth =  require('../config/auth');
var isUser = auth.isUser;

//==============
//Get Product Model
//=============
var Product = require('../models/product');
//==============
//Get Category Model
//=============
var Category = require('../models/category');

//Get all products

router.get('/',  function(req, res) {
   // router.get('/', isUser, function(req, res) {
    console.log("[All prducts rout] calling all products");
    //res.send('working on my project yo!!!');
    Product.find(function(err, products) {
        if (err) {
            console.log(err);
        }
        console.log(products + "=======allprosucts");
        res.render('all_products', {
            title: 'All products',
            products: products
        });


    });

});

//Get products by category

router.get('/:category', function(req, res) {
    //res.send('working on my project yo!!!');
    console.log("[product/category]displaying category requested " + req.params.category);

    var categorySlug = req.params.category;
    Category.findOne({ slug: categorySlug }, function(err, c) {
        if (err) {
            console.log(err);
        }
        Product.find({ category: categorySlug }, function(err, products) {
            if (err) {
                console.log(err);
            }
            console.log("cat products:" + products);
            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });
});

//Get product details

router.get('/:category/:product', function(req, res) {
    console.log("[Product.js/cat/prod] show requested product " + req.params.product);
    var galleryImages = null;
    var loggedin = (req.isAuthenticated())?true:false;
    Product.findOne({ slug: req.params.product }, function(err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';
            fs.readdir(galleryDir, function(err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedin: loggedin
                    })
                }
            });
        }

    });

});



//Exports
module.exports = router;