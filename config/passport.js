var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                console.log('[passport.js] error: ' + err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'no user found!'
                });
            }
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) {
                    console.log('[passport.js] Compare error: ' + err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, {
                        message: 'Wrong password!'
                    });
                }

            });
        });
    }));
    passport.serializeUser(function(user, done) {
        console.log("passport debug" + JSON.stringify(user));
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}