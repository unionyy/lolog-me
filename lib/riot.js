const PLATFORM_MY = {
    kr: 0
}

const riotApi = require('./riot-api'); 
const dbio = require('./dbio');

const riot = require('../secure/riot.json');
const e = require('express');
const mytoken = riot['token'];

/* Called before use */
module.exports.Init = function() {
    dbio.Init();

    riotApi.SetGlobalConfig({
        token: mytoken,
        log: true
    });

    /* Test Riot API */
    riotApi.LOLSTATUSV4.platformData('kr')
    .then(data => {
        if(data.code === 200) {
            console.log('Riot API working...!');
        }
        else {
            console.log('Riot API not working...');
            console.log(data.json);
        }
    }, err => {
        console.log(err);
    });
}

module.exports.Search = async function(_normName, _platform) {
    var summoner = await riotApi.SummonerV4.byName(_normName, 'kr');

    if(summoner.code === 200) {
        var league = await riotApi.LeagueV4.bySummoner(summoner.json.id, 'kr');
        
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

            var inputData = {
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

            console.log(inputData);

            dbio.InputUser(inputData).then(result => {
                console.log(result);
            })

        } else {
            console.log('no league data', league);
        }
    }
    else {
        console.log('no user', summoner);
    }
}