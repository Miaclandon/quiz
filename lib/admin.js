const connection = require('./db');
const bcrypt = require('bcrypt');


function Admin() {};

Admin.prototype = {
    find : function(admin = null, callback)
    {
        if(admin) {
            var field = Number.isInteger(admin) ? 'id' : 'adminname';
        }
        // prepare the sql query
        let sql = `SELECT * FROM admins WHERE ${field} = ?`;


        connection.query(sql, admin, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    create : function(body, callback)
    {
        var pwd = body.password;
        // Hash the password before insert it into the database.
        body.password = bcrypt.hashSync(pwd,10);

        // this array will contain the values of the fields.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO admins(adminname, password) VALUES (?, ?)`;
        // call the query give it the sql string and the values (bind array)
        connection.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    login : function(adminname, password, callback)
    {
        // find the user data by his username.
        this.find(adminname, function(admin) {
            // if there is a user by this username.
            if(admin) {
                // now we check his password.
                if(bcrypt.compareSync(password, admin.password)) {
                    // return his data.
                    callback(admin);
                    return;
                }
            }
            // if the username/password is wrong then return null.
            callback(null);
        });

    }

}

module.exports = Admin;