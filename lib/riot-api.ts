/***********  lib/riot-api.js ***********
 * 
 * Riot API HTTPS Requests
 * 
 * * Used API **
 * LOL-STATUS-V4
 * SUMMONER-V4
 * LEAGUE-V4
 * MATCH-V4
 * *************
 ***************************************/

import https from 'https';
import urlencode from 'urlencode';
import { PLATFORM_ROUTING } from './constant';
import { RIOT_TOKEN } from '../config.json';

export { SetGlobalConfig, LOLSTATUSV4, SummonerV4, LeagueV4, MatchV5 }

const BASEURL = '.api.riotgames.com'

type RiotApiConfig = {
    attempts: number,
    period: number,
    log: boolean
}

type CustomHttpResponse = {
    code: number,
    json: Object
}

var config_global: RiotApiConfig = {
    attempts: 5,
    period  : 1000, // ms
    log     : false
}


/* HTTPS GET REQUEST */
function HttpsReq(_hostname : string, _path : string, _log : boolean): Promise<CustomHttpResponse> {
    const options = {
        hostname: _hostname,
        port: 443,
        path: _path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Riot-Token": RIOT_TOKEN
        },
    };
    return new Promise((resolve, reject) => {
        const req = https.get(options, (res: any) => {
            if(_log) {
                console.log(`Get: ${_hostname}${_path}, statusCode: ${res.statusCode}`);
            }
            res.setEncoding('utf-8');

            var _res = '';
            res.on('data', (d: any) => {
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
        req.on('error', (error: any) => {
            reject(error);
        });
    });
}


/* Make Overrided Configure */
function MakeConfig(_config: RiotApiConfig | null): RiotApiConfig {
    if(_config) {
        var config_overided = {
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

/* Request with Query Prameters */
async function QueryReq (_path: string, _params: { [x: string]: any; }, _platform: string, _config: RiotApiConfig | null) {
    const config: RiotApiConfig = MakeConfig(_config);

    /* Make Query Parameters */
    var query_params = '';
    for(const param in _params) {
        if(query_params === '') {
            query_params += '?';
        }else {
            query_params += '&';
        }
        query_params += param + '=';
        query_params += urlencode.encode(_params[param]);
    }

    _path += query_params;

    for (var i = 1; i < config.attempts; i++) {
        var req;
        try {
            req = await HttpsReq(_platform + BASEURL, _path, config.log);
        } catch(err) {
            throw err;
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
            if(config.log) {
                console.log('waiting...');
            }
            setTimeout(function() {
                resolve(true)
              }, config.period);
        })
        
    }

    return HttpsReq(_platform + BASEURL, _path, config.log);
}

function SetGlobalConfig (_config: any) {
    config_global = MakeConfig(_config);

    if(config_global.log) {
        console.log('configure set', config_global);
    }
}

const LOLSTATUSV4 = {
    platformData: function(_platform: string, _config: RiotApiConfig | null=null) {
        return QueryReq('/lol/status/v4/platform-data', {}, _platform, _config);
    }
}

const SummonerV4 = {
    byAccount: function(_encryptedAccountId: string, _platform: string, _config: RiotApiConfig | null=null) {
        const path = '/lol/summoner/v4/summoners/by-account/' + urlencode.encode(_encryptedAccountId);
        return QueryReq(path , {}, _platform, _config);
    },
    byName: function(_summonerName: string, _platform: string, _config: RiotApiConfig | null=null) {
        const path = '/lol/summoner/v4/summoners/by-name/' + urlencode.encode(_summonerName)
        return QueryReq(path, {}, _platform, _config);
    },
    byPUUID: function(_encryptedPUUID: string, _platform: string, _config: RiotApiConfig | null=null) {
        const path = '/lol/summoner/v4/summoners/by-puuid/' + urlencode.encode(_encryptedPUUID);
        return QueryReq(path, {}, _platform, _config);
    },
    bySummonerId: function(_encryptedSummonerId: string, _platform: string, _config: RiotApiConfig | null=null) {
        const path = '/lol/summoner/v4/summoners/' + urlencode.encode(_encryptedSummonerId);
        return QueryReq(path, {}, _platform, _config);
    }
}

const LeagueV4 = {
    bySummoner: function(_encryptedSummonerId: string, _platform: string, _config: RiotApiConfig | null=null) {
        const path = '/lol/league/v4/entries/by-summoner/' + urlencode.encode(_encryptedSummonerId);
        return QueryReq(path, {}, _platform, _config);
    }
}

const MatchV5 = {
    matches: function(_matchId: string, _platform: string, _config: RiotApiConfig | null=null) {
        _matchId = `${_platform.toUpperCase()}_${_matchId}`;
        _platform = PLATFORM_ROUTING[_platform]!;
        const path = '/lol/match/v5/matches/' + urlencode.encode(_matchId);
        return QueryReq(path, {}, _platform, _config);
    },
    byPUUID: function(_encryptedPUUID: string, _params: any, _platform: string, _config: RiotApiConfig | null=null) {
        _platform = PLATFORM_ROUTING[_platform]!;
        const path = `/lol/match/v5/matches/by-puuid/${urlencode.encode(_encryptedPUUID)}/ids`;
        return QueryReq(path, _params, _platform, _config);
    },
    timeline: function(_matchId: string, _platform: string, _config: RiotApiConfig | null=null) {
        _matchId = `${_platform.toUpperCase()}_${_matchId}`;
        _platform = PLATFORM_ROUTING[_platform]!;
        const path = `/lol/match/v5/matches/${urlencode.encode(_matchId)}/timeline`;
        return QueryReq(path, {}, _platform, _config);
    }
}