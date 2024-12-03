const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const sketchRouter = require('./routes/sketch');
app.use('/', sketchRouter);

// 404 Page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});