var express = require('express');
var router = express.Router();

let connection = require('../lib/db');
/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM topics ORDER BY id desc',function(err,rows)     {

    if(err){
      req.flash('error', err);
      res.render('index',{page_title:"topics - Node.js",data:''});
    }else{

      res.render('index',{page_title:"topics - Node.js",data:rows});
    }

  });
});
module.exports = router;
