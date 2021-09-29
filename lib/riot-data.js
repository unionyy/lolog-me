/*************  riot.js *************
 * 
 * Get Game Data from DB or Riot API
 * Parse API data & INSERT to DB
 * 
 * Return json type object data
 * 
 ** export functions
 * Init
 * SearchSummonerName
 * SearchSummonerPUUID ?
 * SearchMatches
 * SearchParticipant
 * SearchMatchDetail
 * 
 ***********************************/


const { PLATFORM_MY, LANE_MY, CHAMPION, QUEUETYPE } = require('./constant');

const riotApi = require('./riot-api'); 
const dbio = require('./dbio');
const ajax = require('./ajax');


var searchQ = {};

module.exports.Testing = async function() {
    for(var i = 0; i < 100; i++) {
        var test = riotApi.SummonerV4.byName('hide', 'kr');
        var j = i;
        test.then(data => {
            console.log(j, data.code);
        })
    }
    
}

/* Initialize DB-IO & RIOT API Server Check  (Called before use) */
module.exports.Init = async function() {
    await dbio.Init();

    riotApi.SetGlobalConfig({
        log: false
    });

    /* Test Riot API */
    var data = await riotApi.LOLSTATUSV4.platformData('kr');

    if(data.code === 200) {
        console.log('Riot API working...!');
    }
    else {
        console.log('Riot API not working...');
        console.log(data.json);
    }
}

/* Search Summoner by Name */
module.exports.SearchSummonerName = async function(_normName, _platform) {
    const dbSummoner = await dbio.GetSummonerName(_normName, _platform);
    // DB Hit
    if(dbSummoner) return dbSummoner;
    // DB Miss
    else {
        const apiSummoner = await SearchSummonerAPI(_normName, _platform);
        // Summoner Not Found
        if(apiSummoner) return false;

        // API Hit
        const dbSummonerPUUID = await dbio.GetSummonerPUUID(apiSummoner.puuid);
        if(dbSummonerPUUID) {
            // Summoner Name Changed
            if(await dbio.UpdateSummoner(apiSummoner)) return await dbio.GetSummonerName(_normName, _platform);
            // DB Update Error
            return false;
        }

        // New Summoner
        if(await dbio.InputSummoner(apiSummoner)) return await dbio.GetSummonerName(_normName, _platform);
        // DB Insert Error
        return false;
    }
};

async function SearchSummonerAPI (_normName, _platform) {
    var searchName = _normName
    if(searchName.length === 2) {
        var addBlank = searchName[0];
        addBlank += ' ';
        addBlank += searchName[1];
        searchName = addBlank;
    }
    const summoner = await riotApi.SummonerV4.byName(searchName, _platform);

    if(summoner.code === 200) {
        const league = await riotApi.LeagueV4.bySummoner(summoner.json.id, _platform);
        
        if(league.code === 200) {
            var solo = {};
            var flex = {};

            for(elem of league.json) {
                if(elem.queueType === 'RANKED_SOLO_5x5') {
                    solo = elem;
                } else if(elem.queueType === 'RANKED_FLEX_SR') {
                    flex = elem;
                }
            }

            return {
                norm_name: _normName,
                platform_my: PLATFORM_MY[_platform],

                account_id: summoner.json.accountId,
                summoner_id: summoner.json.id,
                puuid: summoner.json.puuid,

                real_name: summoner.json.name,
                profile_icon_id: summoner.json.profileIconId,
                summoner_level: summoner.json.summonerLevel,

                solo_tier: solo.tier || 'Unranked',
                solo_rank: solo.rank || 'none',
                solo_lp: solo.leaguePoints || 0,
                solo_wins: solo.wins || 0,
                solo_losses: solo.losses || 0,

                flex_tier: flex.tier || 'Unranked',
                flex_rank: flex.rank || 'none',
                flex_lp: flex.leaguePoints || 0,
                flex_wins: flex.wins || 0,
                flex_losses: flex.losses || 0,
            };

        } else {
            console.log('no league data', league);
            return false;
        }
    }
    else {
        console.log('no user', summoner.code);
        return false;
    }
}

/* Search Matches from RIOT API ONLY */
module.exports.SearchMatches = async function(_puuid, _platform) {
    const apiMatches = await riotApi.MatchV5.byPUUID(_puuid, { cout: 100 }, _platform);
    if(apiMatches.code == 200) return apiMatches.json;
    else {
        console.log('no matches', apiMatches.code);
        return false;
    }
}

module.exports.SearchParticipant = async function(_matchId) {

}

/************************* Dep *********************/

module.exports.SearchId = async function(_accountId, _platform) {
    var rev = await dbio.GetUserAccountId(_accountId, _platform, 'norm_name');
    if(rev) {
        return rev;
    } else {
        var summoner = await riotApi.SummonerV4.byAccount(_accountId, _platform);
        if (summoner.code === 200) {
            return {norm_name: summoner.json.name};
        } else {
            throw `No User (${_platform}): ${_accountId}`;
        }
    }
}

module.exports.SearchDetail = async function(_normName, _platform, _gameIds) {
    if(_gameIds.length === 0) return {"data": []};
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform], 'id_my');
    var rev = {};
    if(userData) {
        var userId = userData.id_my;

        /** From DB */
        var participants = await dbio.GetParticipants(userId, _gameIds);
        if(participants) {
            for (part of participants) {
                var gameId = part.game_id;
                delete part.id_my;
                rev[gameId] = part;
            }
        }

        /** From API */
        var xGameIds = [];
        var promises = [];
        for (gameId of _gameIds) {
            if(rev[gameId] === undefined) {
                xGameIds.push(gameId);
                promises.push(this.GetGame(gameId, _platform));
            }
        }
        if(xGameIds.length > 0) {
            for(elem of promises) {
                await elem;
            }
            var xParticipants = await dbio.GetParticipants(userId, xGameIds);
            if(xParticipants) {
                for (part of xParticipants) {
                    var gameId = part.game_id;
                    delete part.id_my;
                    rev[gameId] = part;
                }
            }
        }
    }

    var revArray = [];
    for(elem of _gameIds) {
        revArray.push(rev[elem]);
    }

    if(revArray.length < 1) {
        return false;
    } else {
        return {"data": revArray};
    }
}

module.exports.SearchCustom = async function(_normName, _platform, _dateBegin, _dateEnd) {
    /** Wait for Search Games */
    var counting = 0;
    while(searchQ[_normName+_platform] && counting < 5) {
        counting++;
        console.log('waiting...', _platform, _normName);
        await new Promise ((resolve, reject) => {
            setTimeout(function(){resolve()}, 1000);
        })
    }
    searchQ[_normName+_platform] = true;

    if(_dateBegin === undefined) {
        _dateBegin = new Date();
    } else {
        //try catch
        _dateBegin = new Date(new Date(_dateBegin) - (- 43200000));
    }
    if(_dateEnd === undefined) {
        _dateEnd = new Date(new Date() - 31622400000);
    } else {
        //try catch
        _dateEnd = new Date(new Date(_dateEnd) - 43200000);
    }

    /** Search From DB & Return Data */
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        // User DB hit
        var rev = await SearchGamesAPI(userData.account_id, _platform, userData.explore_idx, _dateEnd, userData.id_my, 4);
        if(rev && rev.complete) {
            dbio.UpdateUserExp(rev.index, userData.puuid);
        }
        var gameData = await dbio.GetGames(userData.id_my, _dateBegin / 1000, _dateEnd / 1000);
        
        delete searchQ[_normName+_platform];
        return {
            userData: userData,
            gameData: gameData
        }
        
    } else {
        // DB miss, API Req
        var apiUserData = await SearchUserAPI(_normName, _platform);
        if(apiUserData) {
            // API hit
            var userDataPuuid = await dbio.GetUserPuuid(apiUserData.puuid);
            if(userDataPuuid) {
                // User DB hit
                await dbio.UpdateUser(apiUserData);

                userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);

                var rev = await SearchGamesAPI(userData.account_id, _platform, userData.explore_idx, _dateEnd, userData.id_my);
                if(rev && rev.complete) {
                    dbio.UpdateUserExp(rev.index, userData.puuid);
                }
                var gameData = await dbio.GetGames(userData.id_my, _dateBegin / 1000, _dateEnd / 1000);
                
                delete searchQ[_normName+_platform];
                return {
                    userData: userData,
                    gameData: gameData
                }
            } else {
                /** New User */
                await dbio.InputUser(apiUserData);

                var newUserData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);

                var rev = await SearchGamesAPI(newUserData.account_id, _platform, newUserData.explore_idx, _dateEnd, newUserData.id_my, 4);

                // console.log('API END')
                // var timeCheck = new Date();
                if(rev && rev.complete) {
                    dbio.UpdateUserExp(rev.index, newUserData.puuid);
                }
                var gameData = await dbio.GetGames(newUserData.id_my, _dateBegin / 1000, _dateEnd / 1000);
                // console.log('DB END');
                // var timeCheck = new Date() - timeCheck;
                // console.log(timeCheck, 'ms')      

                delete searchQ[_normName+_platform];
                return {
                    userData: newUserData,
                    gameData: gameData
                }

            }
        } else {
            /** No User */
            delete searchQ[_normName+_platform];
            return false;
        }
    }
}

module.exports.Update = async function (_normName, _platform, _time=60000) {
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        /** Time Limit */
        if((new Date() - userData.update_time) < _time) {
            return false;
        }

        /* API Request */
        var apiUserData = await SearchUserAPI(_normName, _platform);

        if(apiUserData) {
            if(userData.puuid === apiUserData.puuid) {
                dbio.UpdateUser(apiUserData);
                // Get New Game Data
                var rev0 = SearchGamesAPI(apiUserData.account_id, _platform, 0, new Date(userData.update_time_g * 1000), userData.id_my);

                // Get 1 Year
                var rev1 = SearchGamesAPI(apiUserData.account_id, _platform, userData.explore_idx, new Date(new Date() - 31536000000), userData.id_my);
                rev0 = await rev0;
                rev1 = await rev1;

                if(rev0 && !rev0.complete) {
                    dbio.UpdateUserExp(rev0.index, apiUserData.puuid);
                    console.log(rev0);
                    console.log(rev0.index)
                    console.log(rev0.complete)
                } else if(rev1 && rev1.complete) {
                    dbio.UpdateUserExp(rev1.index, apiUserData.puuid);
                } else if(!rev1) {
                    dbio.UpdateUserExp(-1, apiUserData.puuid);
                }

                return true;
            } else {
                dbio.RemoveNameUser(userData.puuid);

                /** PUUID Check */
                var userDataPuuid = await dbio.GetUserPuuid(apiUserData.puuid);
                if(userDataPuuid) {
                    await dbio.UpdateUser(apiUserData);
                    
                    // Get New Game Data
                    var rev0 = await SearchGamesAPI(apiUserData.account_id, _platform, 0, new Date(userDataPuuid.update_time_g * 1000), userDataPuuid.id_my);

                    // Get 1 Year
                    var rev1 = await SearchGamesAPI(apiUserData.account_id, _platform, userDataPuuid.explore_idx, new Date(new Date() - 31536000000), userDataPuuid.id_my);

                    rev0 = await rev0;
                    rev1 = await rev1;

                    if(rev0 && !rev0.complete) {
                        dbio.UpdateUserExp(rev0.index, userDataPuuid.puuid);
                        console.log(rev0);
                        console.log(rev0.index)
                        console.log(rev0.complete)
                    } else if((rev1 && rev1.complete)) {
                        dbio.UpdateUserExp(rev1.index, userDataPuuid.puuid);
                    } else if(!rev1) {
                        dbio.UpdateUserExp(-1, userDataPuuid.puuid);
                    }
                    
                    return true;
                } else {
                    return true;
                }

            }

        } else {
            dbio.RemoveNameUser(userData.puuid);
            return true;
        }
    } else {
        return true;
    }
}

module.exports.GetGame = async function (_matchId, _platform, _ret=true) {
    const data = await riotApi.MatchV4.matches(_matchId, _platform);
    if(data.code === 200) {
        const match = ajax.Match(data.json);

        var games = [];
        
        for(teamId in match.teams) {
            var team = teamId;

            for(participant of match.teams[team].participants) {
                var detailGame = {
                    game_id:        _matchId,

                    duration:       match.duration,
                    win_my:         match.teams[team].win,
                    total_kills:    match.teams[team].kills,

                    spell1:         participant.spell1Id,
                    spell2:         participant.spell2Id,

                    stats:          participant.stats
                }

                var userId = await dbio.GetUserAccountId(participant.id.accountId, _platform, 'id_my');
                if(userId) {
                    detailGame.id_my = userId.id_my;
                    games.push(detailGame);
                }
            }
        }

        if(games.length > 0) {
            dbio.InputParticipants(games);
        }

        if(_ret) return match;
        else return true;
    } else {
        throw `Cannot Get Game(${data.code}): ` + _matchId;
    }
}

function FindPosition(_lane, _role, _champ, _mode) {
    if(QUEUETYPE[_mode] !== 'solo' && QUEUETYPE[_mode] !== 'flex' && QUEUETYPE[_mode] !== 'norm') {
        return LANE_MY['NONE'];
    }
    var position = 'UNKNOWN';
    switch(_lane) {
        case 'TOP':
            if(_role === 'SOLO') {
                position = 'TOP';
            }
            break;
        case 'JUNGLE':
            if(_role === 'NONE') {
                position = 'JUNGLE';
            }
            break;
        case 'MID':
        case 'MIDDLE':
            if(_role === 'SOLO') {
                position = 'MIDDLE';
            }
            break;
        case 'BOT':
        case 'BOTTOM':
            if(_role === 'DUO_SUPPORT') {
                position = 'SUPPORT';
            } else if(_role === 'DUO_CARRY') {
                position = 'BOTTOM';
            }
            break;
        default:
            break;
    }
    if(position === 'UNKNOWN') {
        // Predict!
        //console.log(_lane, _role, CHAMPION[_champ])
    }
    return LANE_MY[position];
}

async function SearchGamesAPI (_encryptedAccountId, _platform, _beginIndex, _timeLimit, _id_my, _multi) {
    if(_beginIndex === -1) {
        return false;
    }

    if(!_multi) {
        _multi = 1;
    }

    var beginIndex = _beginIndex;
    var complete = false;

    while(true) {
        var gameQueue = [];
        for(var i = 0; i < _multi; i++) {
            gameQueue[i] = riotApi.MatchV4.byAccount({
                encryptedAccountId: _encryptedAccountId,
                beginIndex: beginIndex + i * 100
            }, _platform)
        }

        var end = false;
        for(var gamesPromise of gameQueue) {
            var games = await gamesPromise;
            if(games.code === 200) {
                var game100 = [];
                var laneCount = {};
                var unknownPosQ = [];
                for(elem of games.json.matches) {
                    
                    var lane_my = FindPosition(elem.lane, elem.role, elem.champion, elem.queue);

                    var game = {
                        id_my: _id_my,
                        game_id: elem.gameId,
                        play_time: parseInt(elem.timestamp/1000),
                        platform_my: PLATFORM_MY[_platform],
                        champion: elem.champion,
                        queue_type: elem.queue,
                        lane_my: lane_my
                    }

                    /** Position Prediction */
                    if(lane_my !== 0) {
                        if(lane_my !== 6) {
                            var champStr = elem.champion
                            if (!laneCount[champStr]) {
                                laneCount[champStr] = {
                                    1: 0,
                                    2: 0,
                                    3: 0,
                                    4: 0,
                                    5: 0
                                }
                            }
                            laneCount[champStr][lane_my]++;
                            
                        } else {
                            unknownPosQ.push(game);
                            continue;
                        }
                    }
                    game100.push(game);
                }

                /** Position Prediction */
                for(elem of unknownPosQ) {
                    var champStr = elem.champion;
                    var max = 0;
                    var maxPos = 6;
                    for(pos in laneCount[champStr]) {
                        if(laneCount[champStr][pos] > max) {
                            max = laneCount[champStr][pos];
                            maxPos = pos;
                        }
                    }
                    elem.lane_my = maxPos;
                    game100.push(elem);
                }
                

                dbio.InputGameMulti(game100).catch(err=> {
                    console.log(err)});
                if(games.json.matches.length < 100) {
                    beginIndex = -1;
                    complete = true;
                    end = true;
                    break;
                } else {
                    if (new Date(games.json.matches[99].timestamp) < _timeLimit) {
                        complete = true;
                        end = true;
                    }
                    
                }
            } else {
                end = true;
                break;
            }
        }
        if(beginIndex !== -1) {
            beginIndex += 100 * _multi;
        }
        if(end) {
            break;
        }
    }
    return {
        index: beginIndex,
        complete: complete
    };
}  

