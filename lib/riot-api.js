const https = require('https');
const { config } = require('process');
const urlencode = require('urlencode');

const BASEURL = '.api.riotgames.com'

var config_global = {
    token   : '',
    log     : false
}

function HttpsReq(_hostname, _path, _token, _log) {
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
            if(_log) {
                console.log(`statusCode: ${res.statusCode}`);
            }
            var _res = '';
            res.on('data', (d) => {
                //process.stdout.write(d); // If you want to print res
                _res += d;
            });
            res.on('end', () => {
                if(_res) {
                    resolve({code: res.statusCode, json: JSON.parse(_res)});
                } else {
                    reject();
                }
                
            });
        });
        req.on('error', (error) => {
            reject(error);
        });
    });
}


/* Make Overrided Configure */
function MakeConfig(_config) {
    if(_config) {
        var config_overided = {
            token   : _config.token    || config_global.token,
            log     : _config.log      || config_global.log
        }

        return config_overided;
    }
    else {
        return config_global;
    }

    
}

/* Request with only Path Prameter */
function NormalReq(_path, _pathParam, _platform, _config) {
    _config = MakeConfig(_config);
    
    var path = _path + urlencode.encode(_pathParam);

    if(_config.log) {console.log('Get: ' + _platform + BASEURL + path);}

    return HttpsReq(_platform + BASEURL, path, _config.token, _config.log);
}

/* Request with Path Prameter and Query Prameters */
function QueryReq (_PATHPARAM, _path, _params, _platform, _config) {

    if(typeof _params === 'string') {
        return NormalReq(_path, _params, _platform, _config);
    }

    _config = MakeConfig(_config);
    
    var path = _path + urlencode.encode(_params[_PATHPARAM]);

    var query_params = '';

    /* Make Query Parameters */
    for(param in _params) {
        if(param === _PATHPARAM) {
            continue;
        } else {
            if(query_params === '') {
                query_params += '?';
            }else {
                query_params += '&';
            }
            query_params += param + '=';
            query_params += urlencode.encode(_params[param]);
        }
    }

    path += query_params;

    if(_config.log) {console.log('Get: ' + _platform + BASEURL + path);}

    return HttpsReq(_platform + BASEURL, path, _config.token, _config.log);
}

module.exports.SetGlobalConfig = function (_config) {
    config_global = MakeConfig(_config);

    if(config_global.log) {
        console.log('configure set', config_global);
    }
}



module.exports.GeneralReq = {
    Normal: function(_path, _pathParam, _platform, _config) {
        return NormalReq(_path, _pathParam, _platform, _config);
    },
    Query: function(_path, _pathParam, _queryParams, _platform, _config) {
        var params = _queryParams;
        params.pathParam = _pathParam;
        return QueryReq('pathParam', _path, params, _platform, _config);
    }
}

module.exports.LOLSTATUSV4 = {
    platformData: function(_platform, _config) {
        return NormalReq('/lol/status/v4/platform-data', '', _platform, _config);
    }
}

module.exports.SummonerV4 = {
    byAccount: function(encryptedAccountId, _platform, _config) {
        return NormalReq('/lol/summoner/v4/summoners/by-account/', encryptedAccountId, _platform, _config);
    },
    byName: function(summonerName, _platform, _config) {
        return NormalReq('/lol/summoner/v4/summoners/by-name/', summonerName, _platform, _config);
    },
    byPUUID: function(encryptedPUUID, _platform, _config) {
        return NormalReq('/lol/summoner/v4/summoners/by-puuid/', encryptedPUUID, _platform, _config);
    },
    bySummonerId: function(encryptedSummonerId, _platform, _config) {
        return NormalReq('/lol/summoner/v4/summoners/', encryptedSummonerId, _platform, _config);
    }
}

module.exports.LeagueV4 = {
    bySummoner: function(encryptedSummonerId, _platform, _config) {
        return NormalReq('/lol/league/v4/entries/by-summoner/', encryptedSummonerId, _platform, _config);
    }
}

module.exports.MatchV4 = {
    byAccount: function(encryptedAccountId, _platform, _config) {
        return QueryReq('encryptedAccountId', '/lol/match/v4/matchlists/by-account/', encryptedAccountId, _platform, _config);
    }
}

