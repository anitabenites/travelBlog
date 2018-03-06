var LocalStrategy   = require('passport-local').Strategy;
var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');
var pg = require('pg');
const connectionString = 'pg:anamariabenitesrodriguez:postgres@localhost:5432/travelBlog';
var pool = new pg.Client(connectionString);
pool.connect();

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
           console.log('deserializing user:',user.username);
           done(null, user);

    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
                const checkUser = pool.query("SELECT * FROM public.users where username='"+ username+"'");
                checkUser.on("end", function(result) {
                    if(result.rows.length==0){
                        console.log('User Not Found with username '+username);
                        return done('User Not Found with username '+username);
                    }
                    else
                    if (!isValidPassword(result.rows[0], password)){
                        console.log('Invalid Password');
                        return done(null, false); // redirect back to login page
                    }
                    else{
                        return done(null, result.rows[0]);
                    }

                })
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            const checkUser = pool.query("SELECT * FROM public.users where username='"+ username+"'");
                checkUser.on("end", function(result) {
                    if(result.rows.length>0){
                        console.log('User already exists with usernae' +username);
                        return done(null, false);
                    }
                    else{
                        const newUser = pool.query(
                            "Insert into users(name, username, email, password, picture, blogTitle, about) values('"+req.body.name+"','"+req.body.username+"','"+req.body.email+"','" + createHash(password)+"','" + req.body.picture + "','" + req.body.blogTitle + "','" + req.body.about + "')");
                        newUser.on('end', () => {

                            var insertedUser = {
                                name: req.body.name,
                                username: req.body.username,
                                password: createHash(password),
                                email: req.body.email,
                                picture: req.body.picture,
                                blogTitle: req.body.blogTitle,
                                about: req.body.about
                            }

                            console.log(insertedUser)
                            console.log("User Inserted.")
                            return done(null, insertedUser);
                        });
                    }

                })
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
