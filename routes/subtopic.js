let express = require('express');
let router = express.Router();
let connection  = require('../lib/db');


/* GET home page. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM subtopics ORDER BY id desc',function(err,rows)     {

        if(err){
            req.flash('error', err);
            res.render('adminSubtopic',{page_title:"topics - Node.js",data:''});
        }else{

            res.render('adminSubtopic',{page_title:"topics - Node.js",data:rows});
        }

    });

});

// SHOW ADD topic FORM
router.get('/add-subtopic', function(req, res, next){
    res.render('admin/add-subtopic', {
        title: 'Добавление новых подтем',
        idTopic: '',
        nameSubTopic: '',
        descriptionTopis: '',
        questions: '',
        results: ''
    })
});


// ADD NEW subtopic POST ACTION
router.post('/add-subtopic', function(req, res, next){
    req.assert('idTopic', 'idTopic is required').notEmpty()//Validate idTopic
    req.assert('nameSubTopic', 'nameSubTopic is required').len(1,255)//Validate nameSubTopic
    req.assert('descriptionTopis', 'A valid descriptionTopic is required').len(1, 8000)  //Validate description
    req.assert('questions', 'A valid questions is required').len(1, 2000)  //Validate description
    req.assert('results', 'A valid results is required').len(1, 2500)  //Validate description

    let errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


        let subtopic = {
            idTopic: req.sanitize('idTopic').escape().trim(),
            nameSubTopic: req.sanitize('nameSubTopic').escape().trim(),
            descriptionTopis: req.sanitize('descriptionTopis').escape().trim(),
            questions: req.sanitize('questions').escape().trim(),
            results: req.sanitize('results').escape().trim()
        }

        connection.query('INSERT INTO subtopics SET ?', subtopic, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/topic/add.ejs
                res.render('admin/add-subtopic', {
                    title: 'Добавление новой подтемы',
                    idTopic: subtopic.idTopic,
                    nameSubTopic: subtopic.nameSubTopic,
                    descriptionTopis: subtopic.descriptionTopis,
                    questions: subtopic.questions,
                    results: subtopic.results
                })
            } else {
                req.flash('success', 'Data added successfully!');
                res.redirect('/adminSubtopic');
            }
        })
    }
    else {   //Display errors to topic
        let error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)


        res.render('admin/add-subtopic', {
            title: 'Добавление новой подтемы',
            idTopic: subtopic.idTopic,
            nameSubTopic: subtopic.nameSubTopic,
            descriptionTopis: subtopic.descriptionTopis,
            questions: subtopic.questions,
            results: subtopic.results
        })
    }
})
// SHOW EDIT topic FORM
router.get('/edit/(:id)', function(req, res, next){

    connection.query('SELECT * FROM subtopics WHERE id = ' + req.params.idSubTopic, function(err, rows, fields) {
        if(err) throw err

        // if topic not found
        if (rows.length <= 0) {
            req.flash('error', 'подтема не найдена с данным id  = ' + req.params.idSubTopic)
            res.redirect('/topics')
        }
        else { // if topic found
            // render to views/admin/edit-subtopic.ejs template file
            res.render('admin/edit-subtopic', {
                title: 'Редактирование темы',
                //data: rows[0],
                idTopic: rows[0].idTopic,
                nameSubTopic: rows[0].nameSubTopic,
                descriptionTopis: rows[0].descriptionTopis,
                questions: rows[0].questions,
                results: rows[0].results
            })
        }
    })

});

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

        connection.query('UPDATE subtopics SET ? WHERE id = ' + req.params.idSubTopic, topic, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/topic/add.ejs
                res.render('admin/edit-subtopic', {
                    title: 'Редактирование подтемы',
                    idTopic: rows[0].idTopic,
                    nameSubTopic: rows[0].nameSubTopic,
                    descriptionTopis: rows[0].descriptionTopis,
                    questions: rows[0].questions,
                    results: rows[0].results
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/adminSubtopic');
            }
        })

    }
    else {   //Display errors to topic
        let error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)


        res.render('admin/edit-subtopic', {
            title: 'Редактирование подтемы',
            idTopic: rows[0].idTopic,
            nameSubTopic: rows[0].nameSubTopic,
            descriptionTopis: rows[0].descriptionTopis,
            questions: rows[0].questions,
            results: rows[0].results
        })
    }
});

// DELETE topic
router.get('/delete-subtopic/(:id)', function(req, res, next) {
    let topic = { id: req.params.id }

    connection.query('DELETE FROM subtopics WHERE id = ' + req.params.idSubTopic, subtopic, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
            // redirect to topics list page
            res.redirect('/adminTopic')
        } else {
            req.flash('success', 'Подтема удалена успешно! id = ' + req.params.id)
            // redirect to topics list page
            res.redirect('/adminTopic')
        }
    })
})


module.exports = router;