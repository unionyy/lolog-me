const https = require('https');
const { resolve } = require('path');
const { config } = require('process');
const urlencode = require('urlencode');
const { PLATFORM_ROUTING } = require('./constant');

const BASEURL = '.api.riotgames.com'

var config_global = {
    token   : '',
    attempts: 5,
    period  : 1000,
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
                console.log(`Get: ${_hostname}${_path}, statusCode: ${res.statusCode}`);
            }
            res.setEncoding('utf-8');

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
            attempts: _config.attempts || config_global.attempts,
            period  : _config.period   || config_global.period,
            log     : _config.log      || config_global.log
        }

        return config_overided;
    }
    else {
        return config_global;
    }

    
}

/* Request with only Path Prameter */
async function NormalReq(_path, _pathParam, _platform, _config) {
    _config = MakeConfig(_config);
    
    var path = _path + urlencode.encode(_pathParam);

    for (var i = 1; i < _config.attempts; i++) {
        var req;
        try{
            req = await HttpsReq(_platform + BASEURL, path, _config.token, _config.log);
        } catch(error) {
            throw error;
        }

        switch(req.code) {
            case 429:   // Rate Limit
            case 500:   // Internal Server Error
            case 502:   // Bade Gateway
            case 503:   // Service Unavailable
            case 504:   // Gateway Timeout
                break;  // Try Again
            default:
                return req; // END
        }
        
        await new Promise((resolve, reject) => {
            if(_config.log) {
                console.log('waiting...');
            }
            setTimeout(function() {
                resolve();
              }, _config.period);
        })
        
    }

    return HttpsReq(_platform + BASEURL, path, _config.token, _config.log);

}

/* Request with Path Prameter and Query Prameters */
async function QueryReq (_PATHPARAM, _path, _params, _platform, _config) {

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

    for (var i = 1; i < _config.attempts; i++) {
        var req;
        try {
            req = await HttpsReq(_platform + BASEURL, path, _config.token, _config.log);
        } catch(err) {
            throw err;
        }
        
        if(req.code !== 429) {
            return req;
        }
        await new Promise((resolve, reject) => {
            if(_config.log) {
                console.log('waiting...');
            }
            setTimeout(function() {
                resolve();
              }, _config.period);
        })
        
    }

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

module.exports.MatchV5 = {
    matches: function(_matchId, _platform, _config) {
        _matchId = `${_platform.toUpperCase()}_${_matchId}`;
        _platform = PLATFORM_ROUTING[_platform];
        return NormalReq('/lol/match/v5/matches/', _matchId, _platform, _config);
    },
    byPUUID: function(_puuid, _params, _platform, _config) {
        _platform = PLATFORM_ROUTING[_platform];
        const path = `/lol/match/v5/matches/by-puuid/${urlencode.encode(_puuid)}/ids`;
        _params.none = "";
        return QueryReq('none', path, _params, _platform, _config);
    },
    timeline: function(_matchId, _platform, _config) {
        _matchId = `${_platform.toUpperCase()}_${_matchId}`;
        _platform = PLATFORM_ROUTING[_platform];
        const path = `/lol/match/v5/matches/${urlencode.encode(_matchId)}/timeline`;
        return NormalReq(path, "", _platform, _config);
    }
}

/************************** Deprecated **************************/

module.exports.MatchV4 = {
    matches: function(matchId, _platform, _config) {
        return NormalReq('/lol/match/v4/matches/', matchId, _platform, _config);
    },
    byAccount: function(encryptedAccountId, _platform, _config) {
        return QueryReq('encryptedAccountId', '/lol/match/v4/matchlists/by-account/', encryptedAccountId, _platform, _config);
    },
    timelinesByMatch: function(matchId, _platform, _config) {
        return NormalReq('/lol/match/v4/timelines/by-match/', matchId, _platform, _config);
    },
    matchesByTornournamentCode: function(tournamentCode, _platform, _config) {
        return NormalReq('/lol/match/v4/matches/by-tournament-code/', tournamentCode + '/ids', _platform, _config);
    }
}