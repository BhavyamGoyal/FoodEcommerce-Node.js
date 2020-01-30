var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.send('Admin Area');
    
});
router.get('/test',function(req,res){
    res.send('Admin Area Test');
    
});
//Exports
module.exports = router;