var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');

//Connect to db
//mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('Connected to Mongodb');
});

//init app
var app = express();

//View engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Set public folder
app.use(express.static(path.join(__dirname,'public')));

//Set routes
var pages = require('./routes/pages.js');
var adminPages = require('./routes/admin_pages.js');

app.use('/',pages);
app.use('/admin/pages',adminPages);

//Start the server
var port = 3000;
app.listen(port,function(){
    console.log('Server started on port'+port);
});