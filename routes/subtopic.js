let express = require('express');
let router = express.Router();
let connection  = require('../lib/db');



/* GET home page. */
router.get('/', function (req, res) {
    connection.query("SELECT * FROM subtopics ORDER BY idSubTopic ASC", function (err,rows) {
        if (err) return console.log(err);
        if(err){
            req.flash('error', err);
            res.render('adminSubtopic',{page_title:"adminSubtopic - Node.js",data:''});
        }else{

            res.render('adminSubtopic',{page_title:"adminSubtopic - Node.js",data:rows});
        }
        console.log(rows);
    })
});
module.exports = router;