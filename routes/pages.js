var express = require('express');
var router = express.Router();

//==============
//Get page Model
//=============
var Page = require('../models/page');

//Get

router.get('/',function(req,res){
    //res.send('working on my project yo!!!');
    Page.findOne({slug: 'home'},function(err,page){
        if(err){
            console.log(err);
        }
       
            res.render('index',{
                title: page.title,
                content: page.content
            });

       
    });
    
});

//Get a Page
router.get('/:slug',function(req,res){
    var slug = req.params.slug;

    Page.findOne({slug: slug},function(err,page){
        if(err){
            console.log(err);
        }
        if(!page){
            res.redirect('/');
        }else{
            res.render('index',{
                title: page.title,
                content: page.content
            });

        }
    });
    
});
//Exports
module.exports = router;