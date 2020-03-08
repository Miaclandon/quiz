const connection = require('./db');
// const bcrypt = require('bcrypt');


function Admin() {};

Admin.prototype = {
    // Find the user data by id or username.
    find : function(admin = null, callback)
    {
        // if the user letiable is defind
        if(admin) {
            // if user = number return field = id, if user = string return field = username.
            let field = Number.isInteger(admin) ? 'AdminID' : 'Password';
        }
        // prepare the sql query
        let sql = `SELECT * FROM admin WHERE ${field} = ?`;


        connection.query(sql, admin, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },
    login : function(AdminID, Password, callback)
    {
        // find the user data by his username.
        this.find(AdminID, function(admin) {
            // if there is a user by this username.
            if(user) {
                // now we check his password.
                if(bcrypt.compareSync(Password, admin.Password)) {
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