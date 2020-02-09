var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
//==============
//Get page Model
//=============
var Page = require('../models/page');

//==============
//Get pages Index
//=============
router.get('/', isAdmin, function(req, res) {
    console.log("[admin-pages] listing pages")
    Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
        res.render('admin/pages', {
            pages: pages
        });
    });

});
//==============
//Get add page
//=============
router.get('/add-page', isAdmin, function(req, res) {

    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/add-page', {
        title: title,
        slug: slug,
        content: content
    });
});
//==============
//Post add page
//=============
router.post('/add-page', function(req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }
    var content = req.body.content;
    var errors = req.validationErrors();
    if (errors) {
        console.log(JSON.stringify(errors));
        res.render('admin/add-page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {

        Page.findOne({ slug: slug }, function(err, page) {

            if (page) {
                req.flash('danger', 'Page slug exist, choose another.');

                res.render('admin/add-page', {

                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
                    });
                    req.flash('success', 'Page added!');
                    res.redirect('/admin/pages');
                });


            }
        });
    }

});

//Sort Pages Function
function sortPages(ids, callback) {
    var count = 0;

    for (let i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;
        (function(count) {
            Page.findById(id, function(err, page) {
                page.sorting = count;
                page.save(function(err) {
                    if (err)
                        return console.log(err);
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }

}

//==============
//Post Reorder pages 
//=============
router.post('/reorder-pages', function(req, res) {
    var ids = req.body['id[]'];
    var count = 0;

    sortPages(ids, function() {
        Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });

    })



});
//==============
//Get edit page
//=============
router.get('/edit-page/:id', isAdmin, function(req, res) {

    Page.findById(req.params.id, function(err, page) {
        if (err)
            return console.log(err);
        res.render('admin/edit-page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });


});

//==============
//Post Edit page
//=============
router.post('/edit-page/:id', function(req, res) {
    console.log("[admin_pages.js]edit pages post request ");
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }
    var content = req.body.content;
    var id = req.params.id;
    var errors = req.validationErrors();
    if (errors) {
        console.log(JSON.stringify(errors));
        res.render('admin/edit-page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {

        Page.findOne({ slug: slug, _id: { '$ne': id } }, function(err, page) {

            if (page) {
                console.log('error');
                req.flash('danger', 'Page slug exist, choose another.');

                res.render('admin/edit-page', {

                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {

                Page.findById(id, function(err, page) {
                    if (err) { return console.log(err); }


                    page.title = title;
                    page.slug = slug;
                    page.content = content;

                    page.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                        Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.pages = pages;
                            }
                        });
                        req.flash('success', 'Page added!');
                        res.redirect('/admin/pages/edit-page/' + id);
                    });
                });



            }
        });
    }

});
//==============
//Get delete page
//=============
router.get('/delete-page/:id', isAdmin, function(req, res) {
    Page.findByIdAndRemove(req.params.id, function(err) {
        if (err) return console.log(err);
        Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });

        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages/');

    });

});
//Exports
module.exports = router;