var express = require('express');
var router = express.Router();

//==============
//Get page Model
//=============
var Produt = require('../models/product');

//Get

router.get('/', function(req, res) {
    //res.send('working on my project yo!!!');
    Page.findOne({ slug: 'home' }, function(err, page) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
});
//Exports
module.exports = router;