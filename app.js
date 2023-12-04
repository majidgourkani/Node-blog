const express = require('express'); 
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const { render } = require('ejs');

var user = "test"
var password = "Test@123321"
//express app
const app = express();

//connect to the MongoDB, and listen for requests
const dbURI = 'mongodb://127.0.0.1:27017/blogs';
mongoose.connect(dbURI)
    //.then((result) => console.log('Connected to the DB'))
    .then((result) => app.listen(3000))
    .catch((err) => console.log('Error Coonection: \n', err));

//regester view engine
app.set('view engine', 'ejs');

// middleware and Statics files
app.use(express.static('publics'));

//logging
//app.use((req, res, next) => {console.log('+ New Request: ', req.hostname, req.url, req.method); next();});
app.use(morgan('dev'))

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'New Blog',
        snippet: 'My first Blog',
        body: 'I\'m trying to create my first blog here ..., Let\'s go and see what will happen.'
    });
    blog.save()
        .then((result) =>{
            res.send(result);
        })
        .catch((err) =>{
            console.log(err);
        })
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/single-blog', (req, res) => {
    Blog.findById('An_ID')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});


//Blog Routs
app.get('/blogs', (req, res) => {
    Blog.find().sort( {createdAt: -1} )
        .then((result) => {
            req,render('index', {title:'All Blogs', blogs: result}); 
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create' })
});

//404 error page
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error' })
});
