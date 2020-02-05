var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    //res.send('working on my project yo!!!');
    res.render('index',{
        title:'Home'
    });
});
router.get('/test',function(req,res){
    res.send('Pages Test');
    
});
//Exports
module.exports = router;