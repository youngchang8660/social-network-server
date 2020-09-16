const express = require('express');
const app = express();
const PORT = 5001;
const mongoose = require('mongoose');
const {MONGOURI} = require('./db')

require('./models/User');
require('./models/Post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

const customizedMiddleware = (req, res, next) => {
    console.log('middleware executed');
    next();
}

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('connected', ()=> {
    console.log('db connected');
});
mongoose.connection.on('error', (err)=> {
    console.log('connection err:', err);
});

// app.use(customizedMiddleware);


app.get('/', (req, res) => {
    console.log('home')
    res.send('Hello World');
});

app.get('/profile', customizedMiddleware, (req, res) => {
    console.log('profile page')
    res.send('my profile page');
});


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});