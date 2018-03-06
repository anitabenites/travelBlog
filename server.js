var express = require('express');
var path = require('path');
var pg = require('pg');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

app.use(logger('dev'));
app.use(session({
  secret: 'travelBlog',
  saveUninitialized: true,
  resave: true
}));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//Initialiaze passport
var initPassport  = require('./passport-init');
initPassport(passport);

const connectionString = 'pg:anamariabenitesrodriguez:postgres@localhost:5432/travelBlog';
var pool = new pg.Client(connectionString);
pool.connect();

app.use('/static', express.static(path.join(__dirname, 'static')));

function dbInit() {
    const query1 = pool.query(
        'CREATE TABLE IF NOT EXISTS public.users(name VARCHAR(40) not null, email VARCHAR(40) not null, username VARCHAR(40) PRIMARY KEY, password VARCHAR(200) not null, blogTitle VARCHAR(100), about TEXT, picture TEXT)');
    query1.on('end', () => {
        console.log("Users table created.")
    });

    const query2 = pool.query(
        'CREATE TABLE IF NOT EXISTS public.posts(id SERIAL PRIMARY KEY, title TEXT not null, body TEXT not null, author VARCHAR(40) references public.users(username),attachment TEXT, date DATE)');
    query2.on('end', () => {
        console.log("Posts table created.")
    });

    const query3 = pool.query(
        'CREATE TABLE IF NOT EXISTS public.comments(post_id INTEGER references public.posts(id) not null, body TEXT not null, author VARCHAR(40) references public.users(username), date DATE)');
    query3.on('end', () => {
        console.log("Comments table created.")
    });
}
dbInit()



//Authentication endpoints
app.post('/login', passport.authenticate('login', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}));
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}));

app.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/success', function (req, res){
    res.send({state: 'success', user:req.user ? req.user : null});
});
app.get('/failure', function (req, res){
    res.send({ state: 'failure', user:null, message: "invalid username or password"});
});
app.get('/confirm-login', function(req, res) {
    res.send(req.user)
});



//frontend routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/createPost', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/viewPost', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/allPosts', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})
app.get('/post/:id', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
})


//Service endpoints to post and retrieve blog posts
app.get('/posts', function(req, res) {
    const allPosts = pool.query('SELECT * FROM public.posts');
    allPosts.on("end", function(result) {
        return res.send(result.rows);
    })
})
app.get('/postDetails/:id', function(req, res) {
    const allPosts = pool.query('SELECT * FROM public.posts, public.users where id='+ req.params.id);
    allPosts.on("end", function(result) {
        return res.send(result.rows);
    })
})
app.post('/posts', function(req, res) {
    const newPost = pool.query("Insert into public.posts(title, body, author, attachment, date) values('"+req.body.title+ "','" + req.body.body + "','" + req.body.author + "','"+ req.body.attachment + "', current_timestamp)");
    newPost.on("end", function(result) {
        return res.send("Post added successfully.");
    })
})

//Service endpoints to retrieve all users
app.get('/users', function(req, res) {
    const allUsers = pool.query('SELECT * FROM public.users');
    allUsers.on("end", function(result) {
        return res.send(result.rows);
    })
})


//Service endpoints to retrieve all comments on a post
app.get('/comments/:id', function(req, res) {
    console.log(req.query)
    const comments = pool.query('SELECT * FROM public.comments, public.users where post_id='+ req.params.id +'and public.comments.author=public.users.username');
    comments.on("end", function(result) {
        return res.send(result.rows);
    })
})

//Service endpoints to add a comment on a post
app.post('/comments', function(req, res) {
    const newComment = pool.query("Insert into public.comments(post_id, body, author, date) values("+req.body.post_id+ ",'" + req.body.body + "','" + req.body.author + "', current_timestamp)");
    newComment.on("end", function(result) {
        return res.send("Comment added successfully.");
    })
})


app.listen('8080', function() {
    console.log("App running on post 8080")
})
