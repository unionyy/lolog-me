const express = require('express');
const app = express();
const port = 1028;

const bodyParser = require('body-parser')
const urlencode = require('urlencode');
const sanitizedHtml = require('sanitize-html');

const template = require('./lib/template.js');
const riotApi = require('./lib/riot-api'); 
const riot = require('./secure/riot.json');
const riotToken = riot['token'];

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

app.get('/user/:username', (req, res) => {
  var ip = req.header('x-forwarded-for');
  var normName = NormalizeName(urlencode.decode(req.params.username));
  console.log(ip, normName)

  riotApi.SetGlobalConfig({
    token: riotToken,
    log: true,
    platform: 'kr'
  });

  riotApi.SummonerV4.byName(normName).then(data => {
    res.send(data);
  })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});