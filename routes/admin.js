let express = require('express');
let router = express.Router();
let connection  = require('../lib/db');


/* GET home page. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM topics ORDER BY id desc',function(err,rows)     {

        if(err){
            req.flash('error', err);
            res.render('admin',{page_title:"topics - Node.js",data:''});
        }else{

            res.render('admin',{page_title:"topics - Node.js",data:rows});
        }

    });

});


// SHOW ADD topic FORM
router.get('/add', function(req, res, next){
    // render to views/topic/add.ejs
    res.render('admin/add', {
        title: 'Add New topics',
        name: '',
        description: ''
    })
});

// ADD NEW topic POST ACTION
router.post('/add', function(req, res, next){
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('description', 'A valid description is required').len(1, 45)  //Validate description

    let errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


        let topic = {
            name: req.sanitize('name').escape().trim(),
            description: req.sanitize('description').escape().trim()
        }

        connection.query('INSERT INTO topics SET ?', topic, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/topic/add.ejs
                res.render('admin/add', {
                    title: 'Add New Customer',
                    name: topic.name,
                    description: topic.description
                })
            } else {
                req.flash('success', 'Data added successfully!');
                res.redirect('/admin');
            }
        })
    }
    else {   //Display errors to topic
        let error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('admin/add', {
            title: 'Add New Customer',
            name: req.body.name,
            description: req.body.description
        })
    }
})

// SHOW EDIT topic FORM
router.get('/edit/(:id)', function(req, res, next){

    connection.query('SELECT * FROM topics WHERE id = ' + req.params.id, function(err, rows, fields) {
        if(err) throw err

        // if topic not found
        if (rows.length <= 0) {
            req.flash('error', 'topics not found with id = ' + req.params.id)
            res.redirect('/topics')
        }
        else { // if topic found
            // render to views/topic/edit.ejs template file
            res.render('admin/edit', {
                title: 'Edit Customer',
                //data: rows[0],
                id: rows[0].id,
                name: rows[0].name,
                description: rows[0].description
            })
        }
    })

})

// EDIT topic POST ACTION
router.post('/update/:id', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate nam           //Validate age
    req.assert('description', 'A valid description is required').notEmpty()  //Validate description

    let errors = req.validationErrors()

    if( !errors ) {

        let topic = {
            name: req.sanitize('name').escape().trim(),
            description: req.sanitize('description').escape().trim()
        }

        connection.query('UPDATE topics SET ? WHERE id = ' + req.params.id, topic, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/topic/add.ejs
                res.render('admin/edit', {
                    title: 'Edit Customer',
                    id: req.params.id,
                    name: req.body.name,
                    description: req.body.description
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/admin');
            }
        })

    }
    else {   //Display errors to topic
        let error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('admin/edit', {
            title: 'Edit Customer',
            id: req.params.id,
            name: req.body.name,
            description: req.body.description
        })
    }
})

// DELETE topic
router.get('/delete/(:id)', function(req, res, next) {
    let topic = { id: req.params.id }

    connection.query('DELETE FROM topics WHERE id = ' + req.params.id, topic, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
            // redirect to topics list page
            res.redirect('/admin')
        } else {
            req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
            // redirect to topics list page
            res.redirect('/admin')
        }
    })
})


module.exports = router;