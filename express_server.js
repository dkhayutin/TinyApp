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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


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
    user : users[req.cookies['id']],

  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user : users[req.cookies['id']]
  };
  res.render("urls_new", templateVars);
});

app.get('/register', (req, res) => {
  res.render('user_register')
})

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    user : users[req.cookies['id']]
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

app.get('/login', (req, res) => {
  res.render('urls_login')
})


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
})

app.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  console.log(req.body.username)
  if (username)
  for (name in users) {
    if (username === users[name].email) {
      if(users[name].password === password ) {
        res.cookie('id', users[name].id)
          res.redirect('/urls')
          return;
      } else {
        res.status(403).send ('Oops! Looks like you entered the wrong password!')
      return;
      }
    }
  }
  res.status(403).send('Are you sure you entered in your username correctly?')
});

app.post('/register', (req, res) => {
  const newEmail = req.body.email
  const newPassword = req.body.password
  if(newEmail.length > 0 && newPassword.length > 0 ) {
    for(key in users) {
      if(users[key].email === newEmail) {
        res.status(400).send ('SORRY FRIEND! THIS EMAIL IS CURRENTLY REGISTERED!')
      }
    }
    let newId = generateRandomString()

    users[newId] = {
      id: newId,
      email: newEmail,
      password: newPassword
    }
    res.cookie('id', newId)
    console.log(users)
    res.redirect('/urls')
  } else {
    res.status(400).send ('OOPS! LOOKS LIKE YOU MISSED A STEP!')
  }

})

app.post('/logout', (req, res) => {
  res.clearCookie('id')
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
