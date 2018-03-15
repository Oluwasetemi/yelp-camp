var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

const campgrounds =  [
  {"name": "Salmon geek", "image": "https://farm4.staticflickr.com/3717/12822913975_18e8b3e69d.jpg" },
    {"name": "Wakajaye hills", "image": "https://farm8.staticflickr.com/7296/28070862692_32f82c02ba.jpg" },
    {"name": "abuja lugbe", "image": "https://farm1.staticflickr.com/316/20487726582_7ff68bfc92.jpg"}
]

app.get('/', (req, res) => {
  res.render('home');
})


app.get('/campgrounds', (req, res) => {

  res.render('campgrounds', {
    campgrounds: campgrounds
  })
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new')
});

app.post('/campgrounds', (req, res) => {
  const {name, image} = req.body;
  console.log(name, image);
  const newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect('campgrounds');
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});