var express = require('express');
var router = express.Router();
//==============
//Get pages Index
//=============
router.get('/',function(req,res){
    res.send('Admin Area');
    
});
//==============
//Get add page
//=============
router.get('/add-page',function(req,res){
    
    var title ="";
    var slug ="";
    var content ="";

    res.render('admin/add-page',{
        title: title,
        slug:slug,
        content:content
    });
});
//==============
//Post add page
//=============
router.post('/add-page',function(req,res){
    
   req.checkBody('title','Title must have a value.').notEmpty();
   req.checkBody('content','Content must have a value.').notEmpty();
   var title =req.body.title;
    var slug =req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if (slug==""){
     slug = title.replace(/\s+/g,'-').toLowerCase();
    }
    var content =req.body.content;
    var errors = req.validationErrors();
    if(errors){
        console.log(JSON.stringify(errors));
        res.render('admin/add-page',{
            errors:errors,
            title: title,
            slug:slug,
            content:content
        });
    }
    else{
        console.log('Success');
    }
    
});
//Exports
module.exports = router;