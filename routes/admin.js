let express = require('express');
const Admin = require('../lib/admin');
let router = express.Router();
let connection  = require('../lib/db');

const admin = new Admin();

/* GET home page. */
router.get('/', function(req, res, next) {
    let admin = req.session.admin;


    connection.query('SELECT * FROM admins ORDER BY id asc',function(err,rows)     {

        if(admin){
            if(err){
                req.flash('error', err);
                res.render('admin',{page_title:"topics - Node.js",data:''});
            }else{

                res.render('admin',{page_title:"topics - Node.js",data:rows});
            }
        } else {
            res.render('admin/adminlogin', {title:"Страница авторизация"});
        }
console.log(rows);
    });

});


// SHOW ADD topic FORM
router.get('/add', function(req, res, next){
    let admin = req.session.admin;

    // render to views/topic/add.ejs
    if(admin){
            res.render('admin/add', {
            title: 'Add New topics',
            name: '',
            description: ''
         })
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

// ADD NEW topic POST ACTION
router.post('/add', function(req, res, next){
    let admin = req.session.admin;
    if(admin){
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
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
})

// SHOW EDIT topic FORM
router.get('/edit/(:id)', function(req, res, next){
    let admin = req.session.admin;
    if(admin){

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
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
}

})
// EDIT topic POST ACTION
router.post('/update/:id', function(req, res, next) {
    let admin = req.session.admin;
    if(admin){
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
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

// DELETE topic
router.get('/delete/(:id)', function(req, res, next) {
    let admin = req.session.admin;
    if(admin){
        let topic = { id: req.params.id }

        connection.query('DELETE FROM topics WHERE id = ' + req.params.id, topic, function(err, result) {
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
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
})
// SUBTOPIC SHOW

//ADD subtopic
router.get('/add-subtopic', function(req, res, next){
    let admin = req.session.admin;
    if(admin){
        res.render('admin/add-subtopic', {
            title: 'Добавить новые подтемы',
            idSubTopic: '',
            idTopic: '',
            nameSubTopic: '',
            descriptionTopis: '',
            questions: '',
            results: ''
        })
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

//action add subtopic
router.post('/add-subtopic', function(req, res, next){
    let admin = req.session.admin;
    if(admin){
        req.assert('idSubTopic', 'idSubTopic is require').len(1,11)     //Validate name
        req.assert('idTopic', 'idTopic is require').len(1,11)     //Validate name
        req.assert('nameSubTopic', 'nameSubTopic is required').len(1,255)
        req.assert('descriptionTopis', 'descriptionTopis is required').len(1,8000)
        req.assert('questions', 'questions is required').len(1,2000)
        req.assert('results', 'results is required').len(1,2500)
        let errors = req.validationErrors()

        if( !errors ) {   //No errors were found.  Passed Validation!


            let subtopic = {
                idSubTopic: req.sanitize('idSubTopic').escape().trim(),
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
                        title: 'Добавить новые подтемы',
                        idSubTopic: subtopic.idSubTopic,
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

            /**
             * Using req.body.name
             * because req.param('name') is deprecated
             */
            res.render('admin/add-subtopic', {
                title: 'Добавить новые подтемы',
                idSubTopic: subtopic.idSubTopic,
                idTopic: subtopic.idTopic,
                nameSubTopic: subtopic.nameSubTopic,
                descriptionTopis: subtopic.descriptionTopis,
                questions: subtopic.questions,
                results: subtopic.results
            })
        }
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

// SHOW EDIT subtopic FORM
router.get('/edit-subtopic/(:idSubTopic)', function(req, res, next){
    let admin = req.session.admin;
    if(admin){

        connection.query('SELECT *  FROM subtopics WHERE idSubTopic = ' + req.params.idSubTopic, function(err, rows, fields) {
            if(err) throw err

            // if topic not found
            if (rows.length <= 0) {
                req.flash('error', 'subtopics not found with idSubTopic = ' + req.params.idSubTopic)
                res.redirect('/adminSubtopic')
            }
            else { // if topic found
                // render to views/topic/edit.ejs template file
                res.render('admin/edit-subtopic', {
                    title: 'Редактировать подтему',
                    idSubTopic: rows[0].idSubTopic,
                    idTopic: rows[0].idTopic,
                    nameSubTopic: rows[0].nameSubTopic,
                    descriptionTopis: rows[0].descriptionTopis,
                    questions: rows[0].questions,
                    results: rows[0].results
                })
            }
        })
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }

});

// EDIT topic POST ACTION
router.post('/update-subtopic/:idSubTopic', function(req, res, next) {
    let admin = req.session.admin;
    if(admin){
        req.assert('idSubTopic', 'idSubTopic is require').len(1,11)     //Validate name
        req.assert('idTopic', 'idTopic is require').len(1,11)     //Validate name
        req.assert('nameSubTopic', 'nameSubTopic is required').len(1,255)
        req.assert('descriptionTopis', 'descriptionTopis is required').len(1,8000)
        req.assert('questions', 'questions is required').len(1,2000)
        req.assert('results', 'results is required').len(1,2500)

        let errors = req.validationErrors()

        if( !errors ) {

            let subtopic = {
                idSubTopic: req.sanitize('idSubTopic').escape().trim(),
                idTopic: req.sanitize('idTopic').escape().trim(),
                nameSubTopic: req.sanitize('nameSubTopic').escape().trim(),
                descriptionTopis: req.sanitize('descriptionTopis').escape().trim(),
                questions: req.sanitize('questions').escape().trim(),
                results: req.sanitize('results').escape().trim()
            }

            connection.query('UPDATE subtopics SET ? WHERE idSubTopic =  ' + req.params.idSubTopic, subtopic, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/topic/add.ejs
                    res.render('admin/edit-subtopic', {
                        title: 'Редактирование темы',
                        idSubTopic: req.params.idSubTopic,
                        idTopic: req.params.idTopic,
                        nameSubTopic: req.body.nameSubTopic,
                        descriptionTopis: req.body.descriptionTopis,
                        questions: req.body.questions,
                        results: req.body.results
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
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

            /**
             * Using req.body.name
             * because req.param('name') is deprecated
             */
            res.render('admin/edit-subtopic', {
                title: 'Редактирование темы',
                idSubTopic: req.params.idSubTopic,
                idTopic: req.params.idTopic,
                nameSubTopic: req.body.nameSubTopic,
                descriptionTopis: req.body.descriptionTopis,
                questions: req.body.questions,
                results: req.body.results
            })
        }
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});
// DELETE topic
router.get('/delete-subtopic/(:idSubTopic)', function(req, res, next) {
    let admin = req.session.admin;
    if(admin){
        let subtopic = { idSubTopic: req.params.idSubTopic }

        connection.query('DELETE FROM subtopics WHERE idSubTopic = ' + req.params.idSubTopic, subtopic, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to topics list page
                res.redirect('/adminSubtopic')
            } else {
                req.flash('success', 'Подтема успешна удалена с  ! id = ' + req.params.idSubTopic)
                // redirect to topics list page
                res.redirect('/adminSubtopic')
            }
        })
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});
router.get('/', function (req, res) {
    connection.query("SELECT * FROM tests ORDER BY id ASC", function (err,rows) {
        if (err) return console.log(err);
        if(err){
            req.flash('error', err);
            res.render('admin/add-test',{data:''});
        }else{
            res.render('admin/add-test',{data:rows});
        }
        console.log(rows);
    })
});
// show form add test
router.get('/add-test', function(req, res, next){
    let admin = req.session.admin;

    // render to views/topic/add.ejs
    if(admin){
        res.render('add-test', {
            title: 'Add New topics',
            nameTheme: '',
            nameTest: ''
        })
    } else {
        res.render('admin/adminlogin');
    }
});

// ADD NEW topic POST ACTION
router.post('/add-test', function(req, res, next){
    let admin = req.session.admin;
    if(admin){
        req.assert('nameTheme', 'nameTheme').len(1, 150)            //Validate name
        req.assert('nameTest', 'nameTest').len(1, 150)  //Validate description

        let errors = req.validationErrors()

        if( !errors ) {   //No errors were found.  Passed Validation!


            let test = {
                nameTheme: req.sanitize('nameTheme').escape().trim(),
                nameTest: req.sanitize('nameTest').escape().trim()
            }

            connection.query('INSERT INTO tests SET ?', test, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/topic/add.ejs
                    res.render('add-test', {
                        title: 'Add New Customer',
                        nameTheme: test.nameTheme,
                        nameTest: test.nameTest
                    })
                } else {
                    req.flash('success', 'Data added successfully!');
                    res.redirect('/admin/adminTest');
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
            res.render('add-test', {
                title: 'Add New Customer',
                nameTheme: test.nameTheme,
                nameTest: test.nameTest
            })
        }
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});
// SHOW EDIT topic FORM
router.get('/edit-test/(:id)', function(req, res, next){
    let admin = req.session.admin;
    if(admin){

        connection.query('SELECT * FROM tests WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err

            // if topic not found
            if (rows.length <= 0) {
                req.flash('error', 'tests not found with id = ' + req.params.id)
                res.redirect('/admin/adminTest')
            }
            else { // if topic found
                // render to views/topic/edit.ejs template file
                res.render('admin/edit', {
                    title: 'Edit Customer',
                    //data: rows[0],
                    id: rows[0].id,
                    nameTheme: rows[0].nameTheme,
                    nameTest: rows[0].nameTest
                })
            }
        })
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }

});
// EDIT topic POST ACTION
router.post('/update-test/:id', function(req, res, next) {
    let admin = req.session.admin;
    if(admin){
        req.assert('nameTheme', 'nameTheme').notEmpty()           //Validate nam           //Validate age
        req.assert('nameTest', 'nameTest').notEmpty()  //Validate description

        let errors = req.validationErrors()

        if( !errors ) {

            let topic = {
                nameTheme: req.sanitize('nameTheme').escape().trim(),
                nameTest: req.sanitize('nameTest').escape().trim()
            }

            connection.query('UPDATE tests SET ? WHERE id = ' + req.params.id, topic, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/topic/add.ejs
                    res.render('admin/edit-test', {
                        title: 'Edit Test',
                        id: req.params.id,
                        nameTheme: req.body.nameTheme,
                        nameTest: req.body.nameTest
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    res.redirect('/admin/adminTest');
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
            res.render('admin/edit-test', {
                title: 'Edit Test',
                id: req.params.id,
                nameTheme: req.body.nameTheme,
                nameTest: req.body.nameTest
            })
        }
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

router.get('/delete-test/(:id)', function(req, res, next) {
    let admin = req.session.admin;
    if(admin){
        let test = { id: req.params.id }

        connection.query('DELETE FROM tests WHERE id = ' + req.params.id, test, function(err, result) {
            if (err) {
                req.flash('error', err)
                // redirect to topics list page
                res.redirect('/admin/adminTest')
            } else {
                req.flash('success', 'Deleted successfully! id = ' + req.params.id)
                // redirect to topics list page
                res.redirect('/admin')
            }
        })
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

//show form add questions
router.get('/add-test-question', function (req, res, next) {
    let admin = req.session.admin;

    // render to views/topic/add.ejs
    if(admin){
        res.render('admin/add-test-question', {
            title: 'Add New question',
            idQuestion: '',
            idTest: '',
            question: ''
        })
    } else {
        res.render('admin/adminlogin');
    }
});

router.post('/add-test-question', function(req, res, next){
    let admin = req.session.admin;
    if(admin){
        req.assert('idQuestion', 'idQuestion').len(1, 25)            //Validate name
        req.assert('idTest', 'idTest').len(1, 25)  //Validate description
        req.assert('question', 'question').len(1, 200)  //Validate description

        let errors = req.validationErrors()

        if( !errors ) {   //No errors were found.  Passed Validation!


            let question = {
                idQuestion: req.sanitize('idQuestion').escape().trim(),
                idTest: req.sanitize('idTest').escape().trim(),
                question: req.sanitize('question').escape().trim()
            }

            connection.query('INSERT INTO questions SET ?', question, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/topic/add.ejs
                    res.render('admin/add-test-question', {
                        title: 'Add New Customer',
                        idQuestion: question.idQuestion,
                        idTest: question.idTest,
                        question: question.question
                    })
                } else {
                    req.flash('success', 'Data added successfully!');
                    res.redirect('/add-test-question');
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
            res.render('admin/add-test-question', {
                title: 'Add New Customer',
                idQuestion: question.idQuestion,
                idTest: question.idTest,
                question: question.question
            })
        }
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});
router.get('/add-test-question-answer', function (req, res, next) {
    let admin = req.session.admin;

    // render to views/topic/add.ejs
    if(admin){
        res.render('admin/add-test-question-answer', {
            title: 'Add New answer',
            idQuestion: '',
            answer: '',
            state: ''
        })
    } else {
        res.render('admin/adminlogin');
    }
});
router.post('/add-test-question-answer', function(req, res, next){
    let admin = req.session.admin;
    if(admin){
        req.assert('idQuestion', 'idQuestion').len(1, 25)            //Validate name
        req.assert('answer', 'answer').len(1, 200)  //Validate description
        req.assert('state', 'state').isBoolean() //Validate description

        let errors = req.validationErrors()

        if( !errors ) {   //No errors were found.  Passed Validation!


            let answer = {
                idQuestion: req.sanitize('idQuestion').escape().trim(),
                answer: req.sanitize('answer').escape().trim(),
                state: req.sanitize('state').escape().trim()
            }

            connection.query('INSERT INTO answers SET ?', answer, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/topic/add.ejs
                    res.render('admin/add-test-question', {
                        title: 'Add New Customer',
                        idQuestion: answer.idQuestion,
                        answer: answer.answer,
                        state: answer.state
                    })
                } else {
                    req.flash('success', 'Data added successfully!');
                    res.redirect('/admin/adminTest');
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
            res.render('admin/add-test-question-answer', {
                title: 'Add New Customer',
                idQuestion: answer.idQuestion,
                answer: answer.answer,
                state: answer.state
            })
        }
    } else {
        res.render('admin/adminlogin', {title:"Страница авторизация"});
    }
});

module.exports = router;