let express = require('express');
let router = express.Router();
let connection  = require('../lib/db');


/* GET home page. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM topics ORDER BY id asc',function(err,rows)     {

        if(err){
            req.flash('error', err);
            res.render('adminTopic',{page_title:"topics - Node.js",data:''});
        }else{

            res.render('adminTopic',{page_title:"topics - Node.js",data:rows});
        }

    });

});



module.exports = router;