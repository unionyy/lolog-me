const { PLATFORM_MY } = require('./constant');
const { LANE_MY } = require('./constant');

const riotApi = require('./riot-api'); 
const dbio = require('./dbio');

const riot = require('../secure/riot.json');
const e = require('express');
const mytoken = riot['token'];

module.exports.Testing = async function() {
    for(var i = 0; i < 100; i++) {
        var test = riotApi.SummonerV4.byName('hide', 'kr');
        var j = i;
        test.then(data => {
            console.log(j, data.code);
        })
    }
    
}

/* Called before use */
module.exports.Init = async function() {
    await dbio.Init();

    riotApi.SetGlobalConfig({
        token: mytoken,
        log: true
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

module.exports.SearchCustom = async function(_normName, _platform, _dateBegin, _dateEnd) {
    if(_dateBegin === undefined) {
        _dateBegin = new Date();
        _dateEnd = new Date(new Date() - 31622400000);
    }

    /** Search From DB & Return Data */
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        // User DB hit
        var rev = await SearchGamesAPIMulti(userData.account_id, _platform, userData.explore_idx, _dateEnd, userData.id_my);
        if(rev && rev.complete) {
            dbio.UpdateUserExp(rev.index, userData.puuid);
        }
        var gameData = await dbio.GetGames(userData.id_my, _dateBegin / 1000, _dateEnd / 1000);
        
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
                var rev = await SearchGamesAPI(userData.account_id, _platform, userData.explore_idx, _dateEnd, userData.id_my);
                if(rev && rev.complete) {
                    dbio.UpdateUserExp(rev.index, userData.puuid);
                }
                var gameData = await dbio.GetGames(userData.id_my, _dateBegin / 1000, _dateEnd / 1000);
                
                return {
                    userData: userData,
                    gameData: gameData
                }
            } else {
                /** New User */
                await dbio.InputUser(apiUserData);

                var newUserData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);

                var rev = await SearchGamesAPIMulti(newUserData.account_id, _platform, newUserData.explore_idx, _dateEnd, newUserData.id_my);

                if(rev && rev.complete) {
                    dbio.UpdateUserExp(rev.index, newUserData.puuid);
                }
                var gameData = await dbio.GetGames(newUserData.id_my, _dateBegin / 1000, _dateEnd / 1000);

                return {
                    userData: newUserData,
                    gameData: gameData
                }

            }
        } else {
            /** No User */
            return false;
        }
    }
}

module.exports.Update = async function (_normName, _platform) {
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        /** Time Limit */
        if((new Date() - userData.update_time) < 60000) {
            return false;
        }

        /* API Request */
        var apiUserData = await SearchUserAPI(_normName, _platform);

        if(apiUserData) {
            if(userData.puuid === apiUserData.puuid) {
                dbio.UpdateUser(apiUserData);

                // Get New Game Data
                var rev0;
                if(userData.update_time_g.Day) {
                    rev0 = SearchGamesAPI(apiUserData.account_id, _platform, 0, new Date(userData.update_time_g * 1000), userData.id_my);
                } else {
                    rev0 = new Promise((resolve, reject) => {
                        resolve();
                    })
                }

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
                }

                return true;
            } else {
                dbio.RemoveNameUser(userData.puuid);

                /** PUUID Check */
                var userDataPuuid = await dbio.GetUserPuuid(apiUserData.puuid);
                if(userDataPuuid) {
                    await dbio.UpdateUser(apiUserData);
                    
                    // Get New Game Data
                    var rev0
                    if(userDataPuuid.update_time_g.Day) {
                        rev0 = await SearchGamesAPI(apiUserData.account_id, _platform, 0, new Date(userDataPuuid.update_time_g * 1000), userDataPuuid.id_my);
                    } else {
                        rev0 = new Promise((resolve, reject) => {
                            resolve();
                        })
                    }

                    // Get 1 Year
                    var rev1 = await SearchGamesAPI(apiUserData.account_id, _platform, userDataPuuid.explore_idx, new Date(new Date() - 31536000000), userDataPuuid.id_my);

                    rev0 = await rev0;
                    rev1 = await rev1;

                    if(rev0 && !rev0.complete) {
                        dbio.UpdateUserExp(rev0.index, userDataPuuid.puuid);
                        console.log(rev0);
                        console.log(rev0.index)
                        console.log(rev0.complete)
                    } else if(rev1 && rev1.complete) {
                        dbio.UpdateUserExp(rev1.index, userDataPuuid.puuid);
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

async function SearchGamesAPI (_encryptedAccountId, _platform, _beginIndex, _timeLimit, _id_my) {
    if(_beginIndex === -1) {
        return false;
    }

    var beginIndex = _beginIndex;
    var complete = false;

    while(true) {
        var games = await riotApi.MatchV4.byAccount({
            encryptedAccountId: _encryptedAccountId,
            beginIndex: beginIndex
        }, _platform)
    
        if(games.code === 200) {
            for(elem of games.json.matches) {
                var game = {
                    id_my: _id_my,
                    game_id: elem.gameId,
                    play_time: parseInt(elem.timestamp/1000),
                    platform_my: PLATFORM_MY[_platform],
                    champion: elem.champion,
                    queue_type: elem.queue,
                    lane_my: LANE_MY[elem.lane]
                }
                await dbio.InputGame(game).catch(err=> {
                    console.log(err)});
            }
            if(games.json.matches.length < 100) {
                beginIndex = -1;
                complete = true;
                break;
            } else {
                if (new Date(games.json.matches[99].timestamp) < _timeLimit) {
                    complete = true;
                    break;
                }
                beginIndex += 100;
            }
        } else {
            break;
        }
    }
    return {
        index: beginIndex,
        complete: complete
    };
}

async function SearchGamesAPIMulti (_encryptedAccountId, _platform, _beginIndex, _timeLimit, _id_my) {
    if(_beginIndex === -1) {
        return false;
    }

    const MULTI = 4;
    var beginIndex = _beginIndex;
    var complete = false;

    while(true) {
        var gameQueue = [];
        for(var i = 0; i < MULTI; i++) {
            gameQueue[i] = riotApi.MatchV4.byAccount({
                encryptedAccountId: _encryptedAccountId,
                beginIndex: beginIndex + i * 100
            }, _platform)
        }

        var end = false;
        for(var gamesPromise of gameQueue) {
            var games = await gamesPromise;
            if(games.code === 200) {
                for(elem of games.json.matches) {
                    var game = {
                        id_my: _id_my,
                        game_id: elem.gameId,
                        play_time: parseInt(elem.timestamp/1000),
                        platform_my: PLATFORM_MY[_platform],
                        champion: elem.champion,
                        queue_type: elem.queue,
                        lane_my: LANE_MY[elem.lane]
                    }
                    await dbio.InputGame(game).catch(err=> {
                        console.log(err)});
                }
                if(games.json.matches.length < 100) {
                    beginIndex = -1;
                    complete = true;
                    end = true;
                    break;
                } else {
                    if (new Date(games.json.matches[99].timestamp) < _timeLimit) {
                        complete = true;
                        end = true;
                        break;
                    }
                    
                }
            } else {
                end = true;
                break;
            }
        }
        if(end) {
            break;
        } else {
            beginIndex += 100 * MULTI;
        }
    }
    return {
        index: beginIndex,
        complete: complete
    };
}  

async function SearchUserAPI (_normName, _platform) {
    var summoner = await riotApi.SummonerV4.byName(_normName, _platform);

    if(summoner.code === 200) {
        var league = await riotApi.LeagueV4.bySummoner(summoner.json.id, _platform);
        
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

            var userData = {
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
                flex_losses: flex.looses || 0,
            };

            return userData;

        } else {
            console.log('no league data', league);
            return false;
        }
    }
    else {
        console.log('no user', summoner);
        return false;
    }
}

/************************************** DEPRECATED ************************************************/
module.exports.SetDate = async function (_normName, _platform, _dateBegin, _dateEnd) { // Begin > End
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        var rev = await SearchGamesAPI(userData.account_id, _platform, userData.explore_idx, _dateEnd, userData.id_my);
        if(rev && rev.complete) {
            dbio.UpdateUserExp(rev.index, userData.puuid);
        }
        var gameData = await dbio.GetGames(userData.id_my, _dateBegin / 1000, _dateEnd / 1000);
        
        return {
            userData: userData,
            gameData: gameData
        }
        
    } else {
        return false;
    }
}

/** return val: data => show, ready => reload, false => no user */
module.exports.Search = async function(_normName, _platform) {
    /** Search From DB & Return Data */
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        var gameData = await dbio.GetGames(userData.id_my, new Date() / 1000, (new Date() - 31622400000) / 1000); // 366 DAYS
        
        return {
            userData: userData,
            gameData: gameData
        }
    } else {
        /* API Request */
        var apiUserData = await SearchUserAPI(_normName, _platform);
        if(apiUserData) {
            var userDataPuuid = await dbio.GetUserPuuid(apiUserData.puuid);
            if(userDataPuuid) {
                await dbio.UpdateUser(apiUserData);
                var gameData = await dbio.GetGames(userData.id_my);
                
                return 'ready';
            } else {
                /** New User */
                await dbio.InputUser(apiUserData);

                var newUserData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);

                // Get Past 1Year Game Data
                var rev = await SearchGamesAPIMulti(newUserData.account_id, _platform, newUserData.explore_idx, new Date(new Date() - 31536000000), newUserData.id_my);

                if(rev && rev.complete) {
                    dbio.UpdateUserExp(rev.index, newUserData.puuid);
                }
                
                return 'ready'

            }
        } else {
            /** No User */
            return false;
        }
    }
}
