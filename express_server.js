var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')


app.set('view engine', 'ejs')
app.use(cookieParser())


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString () {
  var text = '';
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 6; i++)
  text += code.charAt(Math.floor(Math.random() * code.length));
  return text;
}

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user : req.cookies['username']
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user : req.cookies['username']
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    user : req.cookies['username']
  };
  res.render("urls_show", templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  console.log(req.params)
  res.redirect(longURL);
});

// i NEED this at some point rp
// app.get('/login', (req, res) => {
// res.render('/login')
// });


app.post('/urls', (req, res) => {
  var shortURL = generateRandomString()
  var longURL= req.body.longURL;
  console.log(req.body)
  urlDatabase[shortURL] = longURL
  res.redirect('/urls')
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.post('/urls/:id', (req, res) => {
  var longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL
  res.redirect('/urls')
} )

app.post('/login', (req, res) => {
  let username = req.body.username
  console.log(req.body.username)
  res.cookie('username', username)
  res.redirect('/urls')
});

app.post('/logout', (req, res) => {
  console.log(req.cookie)
  res.clearCookie('username')
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
