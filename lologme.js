const { PLATFORM_MY } = require('./lib/constant');

const express = require('express');
const app = express();
const port = 1029;

const bodyParser = require('body-parser')
const urlencode = require('urlencode');
const sanitizedHtml = require('sanitize-html');
const cookieParser = require('cookie-parser')
const path = require('path')
const { I18n } = require('i18n')
const i18n = new I18n({
  locales: ['en', 'ko'],
  cookie: 'lang-lologme',
  directory: path.join(__dirname, 'locales')
})

const template = require('./lib/template.js');
const riot = require('./lib/riot.js');
const { nextTick } = require('process');

function NormalizeName(name) {
  var username = name;
  username = username.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
  username = username.replace(/ /g,'');
  username = username.toLowerCase();
  username = sanitizedHtml(username);
  return username;
}

app.use(cookieParser());
app.use(i18n.init);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(template.HTMLindex(res.__));
});

app.get('/lang-ko', function (req, res) {
  res.cookie('lang-lologme', 'ko');
  res.redirect('back');
});

app.get('/lang-en', function (req, res) {
  res.cookie('lang-lologme', 'en');
  res.redirect('back');
});

app.post('/search', (req, res) => {
  res.redirect(`/user/${urlencode.encode(req.body.platform)}/${urlencode.encode(req.body.username)}`);
});

app.post('/fsearch', (req, res) => {
  var normName = NormalizeName(urlencode.decode(req.body.username));
  riot.Update(normName, 'kr').then(data => {
    res.redirect(`/user/${normName}`);
  })
});

app.get('/user/:platform/:userName', (req, res, next) => {
  var platform = req.params.platform;

  if(!PLATFORM_MY[platform]) {
    next();
  }

  var ip = req.header('x-forwarded-for');
  var normName = NormalizeName(urlencode.decode(req.params.userName));
  console.log(ip, normName)

  riot.Search(normName, 'kr').then(data=> {
    if(!data) {
      res.send(template.HTMLnouser(normName, res.__));
    } else if(data === 'ready') {
      res.redirect(`/user/${urlencode.encode(normName)}`);
    } else {
      res.send(template.HTMLuser(data, res.__));
    }
  }, err => {
    console.log(err);
    res.send('Error');
  })
});

app.get('/match/:matchId', (req, res) => {
  res.send('Sorry, Not Support Yet......');
});

//Error Handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.use(function (req, res, next) {
  res.status(404).send(template.HTML404(res.__))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  riot.Init().then(()=> {
    // riot.Search('devil', 'kr').then(data=> {
    //   console.log(data);
    // })
  });
});