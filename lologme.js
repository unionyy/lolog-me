const express = require('express');
const app = express();
const port = 1029;

const bodyParser = require('body-parser')
const urlencode = require('urlencode');
const sanitizedHtml = require('sanitize-html');

const template = require('./lib/template.js');
const riot = require('./lib/riot.js');

function NormalizeName(name) {
  var username = name;
  username = username.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
  username = username.replace(/ /g,'');
  username = username.toLowerCase();
  username = sanitizedHtml(username);
  return username;
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(template.HTMLindex());
});

app.post('/search', (req, res) => {
  res.redirect(`/user/${urlencode.encode(req.body.username)}`);
});

app.post('/fsearch', (req, res) => {
  var normName = NormalizeName(urlencode.decode(req.body.username));
  riot.Update(normName, 'kr').then(data => {
    res.redirect(`/user/${normName}`);
  })
});

app.get('/user/:userName', (req, res) => {
  var ip = req.header('x-forwarded-for');
  var normName = NormalizeName(urlencode.decode(req.params.userName));
  console.log(ip, normName)

  riot.Search(normName, 'kr').then(data=> {
    if(!data) {
      res.send(template.HTMLnouser(normName));
    } else if(data === 'ready') {
      res.redirect(`/user/${urlencode.encode(normName)}`);
    } else {
      res.send(template.HTMLuser(data));
    }
  }, err => {
    console.log(err);
    res.send('Error');
  })
});

app.get('/match/:matchId', (req, res) => {
  res.send('Sorry, Not Support Yet......');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  riot.Init().then(()=> {
    // riot.Search('devil', 'kr').then(data=> {
    //   console.log(data);
    // })
  });
});