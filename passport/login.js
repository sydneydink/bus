// This is the passport strategy for login.
// This is connected in passport/init.js

var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){
    passport.use('login', 
        new LocalStrategy({passReqToCallback : true},
        function(req, username, password, done) { 
            User.findOne(
                { 'username': username },
                function(err, user) {
                    
                    if (err) return done(err);
                    
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }

                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    
                    return done(null, user);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
        console.log('comparing password')
        return bCrypt.compareSync(password, user.password);
    }
    
}