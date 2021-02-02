const PLATFORM_MY = {
    kr: 0
}
const LANE_MY = {
    NONE: 0,
    TOP: 1,
    MID: 2,
    JUNGLE: 3,
    BOTTOM: 4,
    SUPPORT: 5
}

const riotApi = require('./riot-api'); 
const dbio = require('./dbio');

const riot = require('../secure/riot.json');
const e = require('express');
const mytoken = riot['token'];

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
        console.log(userData);
        var gameData = await dbio.GetGames(userData.id_my);
        console.log(gameData);
        return(userData); // test
    } else {
        /* API Request */
        var apiUserData = await SearchUserAPI(_normName, _platform);
        if(apiUserData) {
            var userDataPuuid = await dbio.GetUserPuuid(apiUserData.puuid);
            if(userDataPuuid) {
                await dbio.UpdateUser(apiUserData);
                /** Update Games ? */
            } else {
                await dbio.InputUser(apiUserData);

                var newUserData = await dbio.GetUser(_normName, PLATFORM_MY[_platform]);

                await SearchGamesAPI(newUserData.account_id, _platform, newUserData.explore_idx, new Date(), newUserData.id_my);
            }
            console.log(apiUserData);
            return apiUserData;
        }
    }
    return false;
}

async function SearchGamesAPI (_encryptedAccountId, _platform, _beginIndex, _timeLimit, _id_my) {
    var gamesData = [];
    while(true) {
        var games = await riotApi.MatchV4.byAccount({
            encryptedAccountId: _encryptedAccountId,
            _beginIndex: _beginIndex
        }, _platform)
    
        if(games.code === 200) {
            for(elem of games.json.matches) {
                var gameData = {
                    id_my: _id_my,
                    game_id: elem.gameId,
                    play_time: parseInt(elem.timestamp/1000),
                    platform_my: PLATFORM_MY[_platform],
                    champion: elem.champion,
                    queue_type: elem.queue,
                    lane_my: LANE_MY[elem.lane]
                }
                await dbio.InputGame(gameData).catch(err=> {
                    console.log(err)});
                gamesData.push(gameData);
                break;
            }
        }
        break;
    }
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