let express = require('express');
const User = require('../lib/user');
const Admin = require('../lib/admin');
let router = express.Router();

let connection = require('../lib/db');

router.get('/', (req,res,next) => {
    res.render('index');
});

const admin = new Admin();

router.post('/adminregister', (req, res, next) =>{
    // prepare an object containing all user inputs.
    let adminInput = {
        adminname: req.body.adminname,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.create(adminInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastId) {
            // Get the user data by it's id. and store it in a session.
            user.find(lastId, function(result) {
                req.session.admin = result;
                req.session.opp = 0;
                res.redirect('/admin');
            });

        }else {
            console.log('Error creating a new admin ...');
        }
    });

});


router.post('/adminlogin', (req, res, next) => {
    admin.login(req.body.adminname, req.body.password, function(result) {
        if(result) {
            // Store the user data in a session.
            req.session.admin = result;
            req.session.opp = 1;
            // redirect the user to the home page.
            res.redirect('/admin');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    })
});

router.get('/admin-loggout', (req, res, next) => {
//     // Check if the session is exist
     if(req.session.admin) {
         // destroy the session and redirect the user to the index page.
         req.session.destroy(function() {
             res.redirect('/');
         });
     }
 });
//post register form


const user = new User();

router.get('/', (req,res,next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    if(user) {
        res.redirect('/home');
        return;
    }
    // IF not we just send the index page.
    res.render('user/authorization', {title:"Страница регистрации"});
});

//get home page
router.get('/home', function(req, res, next) {
    let user = req.session.user;

    connection.query('SELECT topics.id, topics.name, subtopics.nameSubTopic, subtopics.descriptionTopis, subtopics.questions, subtopics.results\n' +
        'FROM topics\n' +
        'INNER JOIN subtopics ON topics.id = subtopics.idTopic ORDER BY id asc',function(err,rows)     {
        if(user){
            req.flash('error', err);
            res.render('home', {page_title:"topics - Node.js",data:rows});
        }else{

            res.render('/');
        }
        console.log(rows)

    });

});
//read subtopic
router.get('/user/readSubtopic/(:idSubtopic)', function(req, res, next) {
    let user = req.session.user;

    connection.query('SELECT * FROM subtopics WHERE idSubTopic = ' + req.params.idSubTopic,function(err,rows)     {
        if(user){
            req.flash('error', err);
            res.render('user/readSubtopic', {
                idSubTopic: req.params.idSubTopic,
                idTopic: req.params.idTopic,
                nameSubTopic: req.params.nameSubTopic
            });
        }else{
            res.render('/home');
        }

    });
});
/*
router.get('/user/readSubtopic/(:idSubtopic)', (req, res)=>{
    const idSubtopic = req.params.idSubTopic;

    connection.query('select * from subtopics where idSubTopic = ', idSubtopic, (error, result) => {
        if (error) throw error;

        res.render('user/readSubtopic')
    });
});
*/

//post login data
router.post('/login', (req, res, next) => {
    user.login(req.body.username, req.body.password, function(result) {
        if(result) {
            // Store the user data in a session.
            req.session.user = result;
            req.session.opp = 1;
            // redirect the user to the home page.
            res.redirect('/home');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    })
});

//post register form
router.post('/register', (req, res, next) =>{
    // prepare an object containing all user inputs.
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastId) {
            // Get the user data by it's id. and store it in a session.
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });

        }else {
            console.log('Error creating a new user ...');
        }
    });

});
// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;
