const { PLATFORM_MY } = require('./lib/constant');

const express = require('express');
const app = express();
const port = 1028;

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
  res.send(template.HTMLindex(res.__, req.cookies['platform-lologme']));
});

app.get('/lang-ko', function (req, res) {
  res.cookie('lang-lologme', 'ko');
  res.redirect('back');
});

app.get('/lang-en', function (req, res) {
  res.cookie('lang-lologme', 'en');
  res.redirect('back');
});

app.post(`/search`, (req, res) => {
  res.redirect(`/${urlencode.encode(req.body.platform)}/user/${urlencode.encode(req.body.username)}`);
});

app.post(`/update`, (req, res) => {
  var normName = NormalizeName(urlencode.decode(req.body.username));

  var platform = urlencode.decode(req.body.platform);
  platform = Object.keys(PLATFORM_MY)[platform];
  riot.Update(normName, platform).then(data => {
    res.redirect(`${urlencode.encode(platform)}/user/${normName}`);
  })
});


app.get(`/:platform/user/:userName`, (req, res, next) => {
  var platform = urlencode.decode(req.params.platform);
  
  if(PLATFORM_MY[platform] === undefined) {
    next();
  }

  res.cookie('platform-lologme', platform);

  // var ip = req.header('x-forwarded-for');
  var normName = NormalizeName(urlencode.decode(req.params.userName));

  console.log(platform, normName);

  riot.SearchCustom(normName, platform).then(data => {
    if (!data) {
      res.send(template.HTMLmsg(`"${req.params.userName}" ${res.__('user_not_found')}`, res.__, req.cookies['platform-lologme']));
    } else if (data === 'ready') {
      res.redirect(`/${platform}/user/${urlencode.encode(normName)}`);
    } else {
      res.send(template.HTMLuser(data, res.__, platform));
    }
  }, err => {
    console.log(err);
    res.send('Error');
  })
});

app.get(`/:platform/user/:userName/year/:date`, (req, res, next) => {
  var platform = urlencode.decode(req.params.platform);
  var date = urlencode.decode(req.params.date);
  
  // Verify
  if(PLATFORM_MY[platform] === undefined) {
    next();
  }

  var normName = NormalizeName(urlencode.decode(req.params.userName));

  var end = new Date(2020, 0, 1);
  var begin = new Date(2020, 3, 31, 23, 59, 59, 999);
  var offset = new Date().getTimezoneOffset() * 60000;

  riot.SetDate(normName, platform, begin, end).then(data => {
    if (!data) {
      res.redirect(`/${platform}/user/${urlencode.encode(normName)}`);
    } else {
      res.send(template.HTMLuser(data, res.__, platform, begin, end, offset));
    }
  }, err => {
    console.log(err);
    res.send('Error');
  });
});

app.get(`/:platform/match/:matchId`, (req, res) => {
  var platform = urlencode.decode(req.params.platform);
  
  if(PLATFORM_MY[platform] === undefined) {
    next();
  }

  res.send(template.HTMLmsg(res.__('not_support_yet'), res.__, req.cookies['platform-lologme']));
});




//Error Handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.use(function (req, res, next) {
  res.status(404).send(template.HTMLmsg(res.__('404_msg'), res.__, req.cookies['platform-lologme']))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  riot.Init().then(()=> {
    // riot.Search('devil', 'kr').then(data=> {
    //   console.log(data);
    // })
  });
});