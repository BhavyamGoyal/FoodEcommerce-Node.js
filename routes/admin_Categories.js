var express = require('express');
var router = express.Router();
//==============
//Get Category Model
//=============
var Category = require('../models/Category');

//==============
//Get Category Index
//=============
router.get('/', function (req, res) {
    Category.find(function (err,categories) {
        res.render('admin/categories', {
            categories: categories
        });
    });
});
//==============
//Get add Category
//=============
router.get('/add-category',function(req,res){
    
    var title ="";
    res.render('admin/add-category',{
        title: title,
    });
});
//==============
//Post add Category
//=============
router.post('/add-category',function(req,res){
    
   req.checkBody('title','Title must have a value.').notEmpty();
   var title =req.body.title;
   var slug = title.replace(/\s+/g,'-').toLowerCase();
   var errors = req.validationErrors();
    if(errors){
        console.log(JSON.stringify(errors));
        res.render('admin/add-category',{
            errors:errors,
            title: title,
        });
    }
    else{

        Category.findOne({ slug: slug }, function (err, category) {
        
            if(category){
                req.flash('danger','Category title exist, choose another.');
                
                res.render('admin/add-category',{
                    
                    title: title,
                    slug:slug,
                });
            }else{
                var category = new Category({
                    title: title,
                    slug:slug,
                });
                category.save(function (err) {
                    if(err){
                     console.log(err);
                    }
                    req.flash('success','Category added!');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
    
});
//==============
//Get edit Category
//=============
router.get('/edit-category/:id',function(req,res){

    Category.findById(req.params.id, function (err, category) {
        if(err)
            return console.log(err);
            res.render('admin/edit-category',{
                title: category.title,
                slug: category.slug,
                id: category._id
            });
    });

    
});

//==============
//Post Edit Category
//=============
router.post('/edit-category/:id',function(req,res){
    console.log("[admin_categories.js]edit categories post request ");
    req.checkBody('title','Title must have a value.').notEmpty();
    var title =req.body.title; 
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var id =req.params.id;
    var errors = req.validationErrors();
    if(errors){
         console.log(JSON.stringify(errors));
         res.render('admin/edit-category',{
             errors:errors,
             title: title,
             id: id
         });
     }
     else{
        console.log("1");
        Category.findOne({slug: slug, _id: { '$ne': id } }, function (err, category) {
            console.log("2");
            if (category){
                 console.log('error');
                 req.flash('danger','Category slug exist, choose another.');
                 
                res.render('admin/edit-category',{
                     
                     title: title,
                     slug:slug,
                     id: id
                 });
             }else{

                Category.findById(id, function (err, category) {
                    if(err)
                       { return console.log(err);}
                        category.title = title;
                        category.slug = slug;
                        category.save(function(err){
                            if(err){
                             console.log(err);
                            }
                            req.flash('success','Category Edited!');
                            res.redirect('/admin/categories/edit-category/'+category.slug);
                        });
                });
                 
 
                 
             }
         });
     }
     
 });
 //==============
//Get delete Category
//=============
router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if(err) return console.log(err);

        req.flash('success','Category deleted!');
                            res.redirect('/admin/categories/');
  
    });
    
});
//Exports
module.exports = router;