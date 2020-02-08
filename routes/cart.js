var express = require('express');
var router = express.Router();

//==============
//Get page Model
//=============
var Produt = require('../models/product');

//Get

router.get('/add/:product', function(req, res) {
    //res.send('working on my project yo!!!');
    var slug = req.params.product;
    Page.findOne({ slug: slug }, function(err, p) {
        if (err) {
            console.log(err);
        }
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                pricec: paarseFloat(p.price).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;
            for (var i = 0; i < cart.length; i++) {
                if (caart[i].title == slug) {
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    pricec: paarseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
            req.flash('ssuccess', 'Product Added To Cart');
            Response.redirect('back');
        }
        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
});
//Exports
module.exports = router;