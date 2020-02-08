var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
//Connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to Mongodb');
});
//init app
var app = express();

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set Globalerror variable
app.locals.errors = null;

//Get Category Model
var Category = require("./models/category");

//Get all categories to pass to header.ejs
Category.find(function(err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});

//Get page Model
var Page = require("./models/page");

//Get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});



//Express fileupload middleware
app.use(fileUpload());

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Express Session MiddleWare
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//Express Validator MiddleWare
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function(value, filename) {
            var extention = (path.extname(filename)).toLowerCase();
            switch (extention) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;

            }
        }
    }
}));

//Express Messages MiddleWare
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.get('*', function(req, res, next) {
    res.locals.cart = req.session.cart;
    next();
})

//Set routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories');
var adminProducts = require('./routes/admin_products');
var cart = require('./routes/cart');


app.use('/', pages);
app.use('/admin', adminPages);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/cart', cart);



//Start the server
var port = 8080;
app.listen(port, function() {
    console.log('Server started on port' + port);
});