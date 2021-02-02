const PLATFORM_MY = {
    kr: 0
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
        var apiUserData = await SearchAPI(_normName, _platform);
        if(apiUserData) {
            var userDataPuuid = await dbio.GetUserPuuid(apiUserData.puuid);
            if(userDataPuuid) {
                await dbio.UpdateUser(apiUserData);
                /** Update Games ? */
            } else {
                await dbio.InputUser(apiUserData);
                /** UPdate API Games */
            }
            return apiUserData;
        }
    }
    return false;
}

async function SearchDB (_normName, _platform) {

}

async function SearchAPI (_normName, _platform) {
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