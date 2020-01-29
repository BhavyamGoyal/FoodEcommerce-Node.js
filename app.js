var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

//Connect to db
mongoose.connect('mongodb+srv://shubhamsatbhaiya:shubhamsatbhaiya@cluster0-ifkov.mongodb.net/test?retryWrites=true&w=majority/FoodECommerce');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('Connected to Mongodb');
});

//init app
var app = express();

//View engine setup
app.set('views',path.join(__dirname,'public'));
app.set('view engine','ejs');

//Set public folder
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.send('working on my project yo!!!');
});

//Start the server
var port = 3000;
app.listen(port,function(){
    console.log('Server started on port'+port);
});