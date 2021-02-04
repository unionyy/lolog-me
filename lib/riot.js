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

module.exports.Search = async function(_normName, _platform) {
    var userData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
    if(userData) {
        var gameData = await dbio.GetGames(userData.id_my);
        
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
                var newUserData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);
                
                return {
                    userData: newUserData,
                    gameData: gameData
                }
            } else {
                await dbio.InputUser(apiUserData);

                var newUserData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);

                // Get Past 1Year Game Data
                var gameData = await SearchGamesAPI(newUserData.account_id, _platform, newUserData.explore_idx, new Date(new Date() - 31536000000), newUserData.id_my);

                await dbio.UpdateUserExp(gameData.beginIndex, newUserData.puuid);
                
                return {
                    userData: newUserData,
                    gameData: gameData.gameData
                }

            }
        } else {
            /** No User */
            return false;
        }
    }
}

async function SearchGamesAPI (_encryptedAccountId, _platform, _beginIndex, _timeLimit, _id_my) {
    var gameData = [];
    var beginIndex = _beginIndex;
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
                gameData.push(game);
            }
            if(games.json.matches.length < 100) {
                beginIndex = -1;
                break;
            } else {
                if (new Date(games.json.matches[99].timestamp) < _timeLimit) {
                    break;
                }
                beginIndex += 100;
            }
        } else if (games.code === 404) {
            beginIndex = -1;
            break;
        } else {
            break;
        }
    }
    return {
        beginIndex: beginIndex,
        gameData: gameData
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
                } else if(elem.queueType === 'RANKED_FLEX_5x5') {
                    duo = elem;
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