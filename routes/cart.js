var express = require('express');
var router = express.Router();

//==============
//Get product Model
//=============
var Product = require('../models/product');

//Get

router.get('/add/:product', function(req, res) {
    //res.send('working on my project yo!!!');
    var slug = req.params.product;
    Product.findOne({ slug: slug }, function(err, p) {
        if (err) {
            console.log(err);
        }
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
            res.flash('success', 'Product Added To Cart');
            res.redirect('back');
        }
        
    });
});
//========================
//Get checkout Page
//==================
router.get('/checkout', function(req, res) {
    res.render('checkout', {
        title: 'Checkout',
        cart: req.session.cart
    })
});
//Exports
module.exports = router;