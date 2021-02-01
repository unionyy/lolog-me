const { write } = require('fs');
const https = require('https');
const { config } = require('process');
const urlencode = require('urlencode');

const BASEURL = '.api.riotgames.com'

var config_global = {
    token   : '',
    platform  : 'kr',
    log     : false
}

function HttpsReq(_hostname, _path, _token) {
    const options = {
        hostname: _hostname,
        port: 443,
        path: _path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Riot-Token": _token
        },
    };
    return new Promise((resolve, reject) => {
        const req = https.get(options, (res) => {
            var _res = '';
            res.on('data', (d) => {
                _res += d;
            });
            res.on('end', () => {
                resolve(JSON.parse(_res));
            });
        });
        req.on('error', (error) => {
            reject(error);
        });
    });
}

/* Make Query Parameters */
function MakeQueryParams(_params, PARAMS) {
    var query_params = '';
    for(param of PARAMS) {
        if(_params[param]) {
            if(query_params === '') {
                query_params += '?';
            }else {
                query_params += '&';
            }
            query_params += param + '=';
            query_params += _params[param];
        }
    }
    return query_params;
}

function MakeConfig(_config) {
    _config = _config || {};

    var config_overided = {
        token   : _config.token    || config_global.token,
        platform: _config.platform || config_global.platform,
        log     : _config.log      || config_global.log
    }

    return config_overided;
}

module.exports.SetGlobalConfig = function (_config) {
    config_global = MakeConfig(_config);

    if(config_global.log) {
        console.log('configure set', config_global);
    }
}

module.exports.SummonerName = async function (name, _config) {
    _config = MakeConfig(_config);

    if(_config.log) {
        console.log('Get Summoner by name: ' + name);
    }
    
    var _path = '/lol/summoner/v4/summoners/by-name/' + urlencode.encode(name);
    return HttpsReq(_config.platform + BASEURL, _path, _config.token);
}

module.exports.LeagueSummonerId = async function (encryptedSummonerId, _config) {
    _config = MakeConfig(_config);

    if(_config.log) {
        console.log('Get League Entry by encryptedSummonerId: ' + encryptedSummonerId);
    }
    
    var _path = '/lol/league/v4/entries/by-summoner/' + encryptedSummonerId;
    return HttpsReq(_config.platform + BASEURL, _path, _config.token);
}

module.exports.MatchAccountId = async function (encryptedAccountId, _config) {
    const PARAMS = ['champion', 'queue', 'season', 'endTime', 'beginTime', 'endIndex', 'beginIndex'];

    _config = MakeConfig(_config);

    var _params;
    var query_params = '';

    if(typeof encryptedAccountId === 'string') {
        _params = {
            encryptedAccountId: encryptedAccountId
        }
    } else {
        _params = encryptedAccountId;
        query_params = MakeQueryParams(_params, PARAMS);
    }

    if(_config.log) {
        console.log('Get League Entry by encryptedAccountId: ' + _params.encryptedAccountId);
    }
    
    var _path = '/lol/match/v4/matchlists/by-account/' + _params.encryptedAccountId + query_params;
    return HttpsReq(_config.platform + BASEURL, _path, _config.token)  
}