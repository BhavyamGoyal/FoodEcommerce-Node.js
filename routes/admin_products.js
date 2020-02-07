var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
//==============
//Get product Model
//=============
var Product = require('../models/product');
//==============
//Get Category Model
//=============
var Category = require('../models/Category');

//==============
//Get products Index
//=============
router.get('/', function (req, res) {
    var count;
    Product.countDocuments(function (err, c) {
        count = c;
        Product.find(function (err, products) {
            res.render('admin/products', {
                products: products,
                count: count
            });
        });
    });

});
//==============
//Get add page
//=============
router.get('/add-product', function (req, res) {

    var title = "";
    var desc = "";
    var price = "";

    Category.find(function (err, cats) {
        res.render('admin/add-product', {
            title: title,
            desc: desc,
            categories: cats,
            price: price
        });
    });
});
//==============
//Post add Product
//=============
router.post('/add-product', function (req, res) {
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('desc', 'Description must have a value.').notEmpty();
    req.checkBody('price', 'Price must have a value as number.').isDecimal();
    req.checkBody('image', 'must Upload an image').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    var errors = req.validationErrors();
    if (errors) {
        Category.find(function (err, cats) {
            res.render('admin/add-product', {
                errors: errors,
                title: title,
                desc: desc,
                categories: cats,
                price: price
            });
        });
    }
    else {

        Product.findOne({ slug: slug }, function (err, product) {

            if (product) {
                req.flash('danger', 'Product exist, choose another.');
                Category.find(function (err, cats) {
                    res.render('admin/add-product', {
                        title: title,
                        desc: desc,
                        categories: cats,
                        price: price
                    });
                });
            } else {
                var price2 = parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile
                });
                product.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    mkdirp('public/product_images/' + product._id).then(made =>
                        console.log('1')
                    );
                    mkdirp('public/product_images/' + product._id + '/gallery').then(made =>
                        console.log("2")
                    );
                    mkdirp('public/product_images/' + product._id + '/gallery/thumbs').then(made => {
                        if (imageFile != "") {
                            var productImage = req.files.image;
                            var path = './public/product_images/' + product._id + '/' + imageFile;
                            console.log(imageFile);
                            productImage.mv(path, function (err) {
                                return console.log("error while saving file" + err);
                            });
                        } else {
                            console.log("file empty");
                        }
                        console.log('3')
                    });


                    req.flash('success', 'product added!');
                    res.redirect('/admin/products');
                });


            }
        });
    }

});
//==============
//Get edit product
//=============
router.get('/edit-product/:id', function (req, res) {

    var errors;
    if (req.session.errors) {
        errors = req.session.errors;
    }
    req.session.errors = null;

    Category.find(function (err, cats) {

        Product.findById(req.params.id, function (err, p) {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                var galleryDir = 'public/product_images/' + p._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;
                        res.render('admin/edit-product', {
                            title: p.title,
                            errors: errors,
                            desc: p.desc,
                            categories: cats,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            price: p.price,
                            image: p.image,
                            galleryImages: galleryImages,
                            id:p._id
                        });
                    }
                });
            }
        });
    });

});

//==============
//Post Edit product
//=============
router.post('/edit-product/:id', function (req, res) {
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('desc', 'Description must have a value.').notEmpty();
    req.checkBody('price', 'Price must have a value as number.').isDecimal();
    req.checkBody('image', 'must Upload an image').isImage(imageFile);


    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' + id);
    }
    else {
        Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, p) {
            if (err) {
                console.log(err);
            }
            if (p) {
                req.flash('danger', 'Product title exists, choose another');
                res.redirect('/admin/products/edit-product/' + id);
            }
            else {
                Product.findById(id, function (err, p) {
                    if (err) {
                        console.log(err);
                    }

                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if (imageFile != "") {
                        p.image = imageFile;
                        //console.log("image file is" + imageFile);
                    }
                    p.save(function (err) {
                        if (err) {
                            console.log(err);
                        }

                        if (imageFile != "") {
                            if (p.image != "") {
                                fs.remove('public/product_images/' + id + '/' + p.image);
                            }

                            var productImage = req.files.image;
                            console.log(req.files);
                            var path = 'public/product_images/' + id + '/' + imageFile;
                            console.log(imageFile);
                            productImage.mv(path, function (err) {
                                return console.log("error while saving file" + err);
                            });
                        }

                        req.flash('success', 'product edited!');
                        res.redirect('/admin/products/edit-product/' + id);
                    });

                });
            }
        });
    }

});

//==============
//post product gallery
//=============

router.post('/product-gallery/:id', function (req, res) {
    console.log("[admin_products] uploading product gallery");
    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath= 'public/product_images/' + id + '/gallery/thumbs/'+ req.files.file.name;
    productImage.mv(path, function (err) {
        if (err) {
            console.log('error while saving gallery' + err);
        } else {
            resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
                fs.writeFileSync(thumbsPath, buf);
            });
        }
    });
    res.sendStatus(200);


});


//==============
//delete product Gallery
//=============

router.get('/delete-image/:image', function (req, res) {
    var path = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    var thumbsPath = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;
    var id = req.params.id;
    
    fs.remove(path, function (err) {
        if (err) {
            console.log("file Remove error" + err);
        } else {
            console.log("[admin_product] OriginalImage Deleted")
            fs.remove(thumbsPath, function (err) {
                if (err) {
                    console.log("file Remove error" + err);
                } else {
                    console.log("[admin_product] Thumb Image Deleted")
                    req.flash('success', 'Image deleted!');
                    res.redirect('/admin/products/edit-product/' + req.query.id);
                }
            });
        }
    });
});


//==============
//Delete product
//=============

router.get('/delete-product/:id', function (req, res) {
    var id = req.params.id;
    var path = 'public/product_images/' + id;
    fs.remove(path, function (err) {
        if (err) {
            console.log("fileRemove error" + err);
        } else {
            Product.findByIdAndRemove(id, function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    req.flash('success', 'Product deleted!');
                    res.redirect('/admin/products/');
                }
            });
        }
    });
});
//Exports
module.exports = router;