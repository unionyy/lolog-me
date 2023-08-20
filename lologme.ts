/***********  lologme.js ***********
 * 
 * Index of LoLog-me
 * - Handle All Interactions with Users
 * - Verify & Parse User Inputs
 * - Send HTTP Requests
 * - Used Web Framework: ExpressJS
 ***********************************/
import http from 'http';
import https from 'https';
import fs from 'fs';

const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;

import { PLATFORM_MY, PLATFORMS } from './lib/constant';

import express from 'express';
const app = express();
const port = 1028;

import crypto from 'crypto';

import bodyParser from 'body-parser';
import urlencode from 'urlencode';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import helmet from 'helmet';
import { I18n } from 'i18n';
const i18n = new I18n({
  locales: ['en', 'ko'],
  cookie: 'lang-lologme',
  directory: path.join(__dirname, 'locales')
})


import template from './lib/templates/template';
import * as riotData from './lib/riot-data';
import { RiotData } from './lib/RiotData';

import { NormalizeName, VerifyMatchId } from './lib/util';
import { GetSummonerShortcut } from './lib/shortcut';

import { IS_DEVELOP, PUBLIC_LOC } from './config.json';

/** Remove GTAG if develop version */
if(IS_DEVELOP) template.RemoveGtag();

const riotDataInstance = new RiotData()
riotDataInstance.initialize()

app.use((_req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    scriptSrc: ["'self'", "https://code.jquery.com", 
              "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://ssl.google-analytics.com", "https://tagmanager.google.com",
              "*.gstatic.com", (_req: any, res: any) => `'nonce-${res.locals.cspNonce}'`],
    imgSrc: ["'self'", "*.leagueoflegends.com", "ddragon.bangingheads.net", "www.googletagmanager.com", "https://www.google-analytics.com" , "https://*.gstatic.com", "https://www.gstatic.com", "data:"],
   
    connectSrc: ["'self'", "https://www.google-analytics.com", "https://ddragon.leagueoflegends.com", "https://ddragon.bangingheads.net/cdn/"]
  }
}));
app.use(cookieParser());
app.use(express.static(PUBLIC_LOC));
app.use(bodyParser.urlencoded({ extended: false }));

/** Language */
app.use((req, res, next) => {
  var lang = req.query.lang;

  switch(lang) {
    case 'ko':
      res.cookie('lang-lologme', 'ko', { maxAge: 3000000000 });
      req.cookies['lang-lologme'] = 'ko';

      break;
    case 'en':
      res.cookie('lang-lologme', 'en', { maxAge: 3000000000 });
      req.cookies['lang-lologme'] = 'en';

      break;
    default:
      break;
  }
  next();
})

/** Lacation Setting along with Language */
app.use((req, res, next) => {
  if(!req.cookies['platform-lologme']) {
    var lang = req.cookies['lang-lologme'];

    switch(lang) {
      case 'ko':
        res.cookie('platform-lologme', 'kr', { maxAge: 3000000000 });
        req.cookies['platform-lologme'] = 'kr';
        break;
      case 'en':
        res.cookie('platform-lologme', 'na1', { maxAge: 3000000000 });
        req.cookies['platform-lologme'] = 'na1';
        break;
      default:
        break;
    }
  }
  next();
})

app.use(i18n.init);

const rateLimit10 = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  handler: function  (_req: any, _res: any, _next: any) {
    /** empty */
  },
  onLimitReached: function (req: any, res: any, options: any) {
    console.log('Rate Limit: user');
    res.status(options.statusCode).send(template.HTMLmsg(res.__('rate_limit'), res.__, req.cookies['platform-lologme'], res.locals.cspNonce));
  }
});
const rateLimit100 = rateLimit({
  windowMs: 10 * 1000,
  max: 100,
  handler: function  (_req: any, _res: any, _next: any) {
    /** empty */
  },
  onLimitReached: function (req: any, res: any, options: any) {
    console.log('Rate Limit: match');
    res.status(options.statusCode).send(template.HTMLmsg(res.__('rate_limit'), res.__, req.cookies['platform-lologme'], res.locals.cspNonce));
  }
});


app.get('/', rateLimit10, (req, res) => {
  res.send(template.HTMLindex(res.__, req.cookies['platform-lologme'], res.locals.cspNonce));
});

app.get(`/search`, rateLimit10, (req, res, next) => {
  try{
    var normName = NormalizeName(req.query.username as string);

    if(typeof(req.query.platform) !== 'string') {
      throw 'unknown platform' + req.query.platform
    }

    const platform : string = req.query.platform

    if(PLATFORM_MY[platform] === undefined) {
      throw 'unknown platform' + platform
    }
    res.redirect(`/${platform}/user/${normName}?save=true`);

  } catch (err) {
    console.log('update Err');
    next();
  }
});

app.get(`/update/:idmy`, rateLimit10, (req, res, next) => {
  const idMy : number = +urlencode.decode(req.params.idmy);

  // Varify idMy
  if(isNaN(idMy)) { next(); return; }

  riotData.UpdateSummoner(idMy, 60000).then(userData => {
    if(!userData) { next(); return; }
    res.redirect(`/${PLATFORMS[userData.platform_my]}/user/${userData.norm_name}`);
  }, err => {
    console.log(err);
    res.status(500).send('Error');
  });
});

app.get(`/id/:idmy`, rateLimit10, (req, res, next) => {
  const idMy : number = +urlencode.decode(req.params.idmy);

  // Varify idMy
  if(isNaN(idMy)) { next(); return; }

  riotData.UpdateSummoner(idMy, 600000).then(userData => {
    if(!userData) { next(); return; }
    res.redirect(`/${PLATFORMS[userData.platform_my]}/user/${userData.norm_name}`);
  }, err => {
    console.log(err);
    res.status(500).send('Error');
  });
});

app.get(`/:platform/user/:userName`, rateLimit10, (req, res, next) => {
  var platform = urlencode.decode(req.params.platform);

  // Verify query
  if(PLATFORM_MY[platform] === undefined) { next(); return; }

  res.cookie('platform-lologme', platform, { maxAge: 3000000000 });

  // var ip = req.header('x-forwarded-for');
  var normName = NormalizeName(urlencode.decode(req.params.userName));

  console.log(platform, normName);

  riotData.SearchSummonerName(normName, platform).then(summonerData => {
    if (!summonerData) {
      res.status(404).send(template.HTMLmsg(`"${req.params.userName}" ${res.__('user_not_found')}`, res.__, req.cookies['platform-lologme'], res.locals.cspNonce));
    } else {
      /** Save Recent Users Cookies */
      if(req.query.save) {
        let recentUsers = req.cookies['recent-lologme-' + platform]
        if(!recentUsers) recentUsers = [];
        try {
          for(var i in recentUsers) {
            if(recentUsers[i] === summonerData.summoner_name) {
              recentUsers.splice(i, 1);
              break;
            }
          }
        } catch(err) {
          recentUsers = [];
        }
        recentUsers.unshift(summonerData.summoner_name);
        res.cookie('recent-lologme-' + platform, recentUsers, { maxAge: 3000000000 });
      }

      riotData.SearchMatchList(summonerData.puuid, platform).then(matchList => {
        res.send(template.HTMLuser(summonerData, matchList, res.__, platform, res.locals.cspNonce, riotDataInstance.riotCdnUri));
      });
    }
  }, err => {
    console.log(err);
    res.status(500).send('Error');
  });
});

app.get(`/:platform/shortcut/:userName`, rateLimit100, (req, res, next) => {
  var platform = urlencode.decode(req.params.platform);

  // Verify query
  if(PLATFORM_MY[platform] === undefined) { next(); return; }

  var normName = NormalizeName(urlencode.decode(req.params.userName));

  console.log("Shortcut: ", platform, normName);

  GetSummonerShortcut(normName, platform).then(data => {
    if(!data) res.status(404).json({error: 404, msg: "Not Found"});
    else res.json(data);
  }, err => {
    console.log(err);
    res.status(500).send('Error');
  });
});

app.get(`/:platform/matches`, rateLimit10, (req, res, next) => {
  var platform = urlencode.decode(req.params.platform);

  /** Verify Platform */
  if(PLATFORM_MY[platform] === undefined) { next(); return; }

  /** Verify idmy */
  if(typeof(req.query.idmy) !== 'string') { next(); return; }
  const idMy : number = +urlencode.decode(req.query.idmy);
  if(isNaN(idMy)) { next(); return; }

  /** Verify Match Ids */
  const matchIds: string[] = [];
  if(Array.isArray(req.query.m)) {
    if(req.query.m.length <= 20) {
      for(const matchId of req.query.m) {
        if(VerifyMatchId(matchId as string)) {
        matchIds.push(matchId as string);
        }
      }
    }
  } else {
    if(VerifyMatchId(req.query.m as string)) {
      matchIds.push(req.query.m as string);
    }
  }

  if(matchIds.length === 0) {
    res.status(404).send(template.HTMLmsg(`404 Not Found`, res.__, req.cookies['platform-lologme'], res.locals.cspNonce));
  } else {
    riotData.SearchMatches(idMy, matchIds).then(data => {
      if (!data) {
        res.status(404).send(template.HTMLmsg(`404 Not Found`, res.__, req.cookies['platform-lologme'], res.locals.cspNonce));
      } else {
        res.json(data);
      }
    }, err => {
      console.log(err);
      res.status(500).send('Error');
    });
  }
});

app.get(`/:platform/match/:matchId`, rateLimit10, (req, res, next) => {
  var platform = urlencode.decode(req.params.platform);

  /** Verify query */
  if(PLATFORM_MY[platform] === undefined) { next(); return; }

  /** Verify Match Id */
  if(!VerifyMatchId(req.params.matchId)) { next(); return; }

  riotData.SearchMatchDetail(req.params.matchId).then((matchData) => {
    res.json(matchData);
  }, (err) => {
    console.log(err);
    next();
  });
})

//Error Handle
app.use(function (err: any, _req: any, res: any, _next: any) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.use(function (req, res, _next) {
  res.status(404).send(template.HTMLmsg(res.__('404_msg'), res.__, req.cookies['platform-lologme'], res.locals.cspNonce))
})

if(!IS_DEVELOP) {
  const options = {
    key: fs.readFileSync('../keys/rootca.key'),
    cert: fs.readFileSync('../keys/rootca.crt')
  }
  http.createServer(app).listen(HTTP_PORT);
  https.createServer(options, app).listen(HTTPS_PORT);
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  riotData.Init();

  setInterval(() => riotDataInstance.patch(), 36000000)
});