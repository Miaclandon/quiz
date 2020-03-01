const mysql = require('mysql');

let connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'1234',
    database: 'testexpress'
});

connection.connect(function (error) {
    if(!!error){
        console.log(error);
    } else {
        console.log('Connected');
    }
});

module.exports = connection;