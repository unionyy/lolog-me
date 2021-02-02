const riotApi = require('./riot-api'); 

// for testing
const riot = require('../secure/riot.json');
const e = require('express');
const mytoken = riot['token'];

/* Called before use */
module.exports.Init = function() {
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

    if(summoner) {
        console.log(summoner);
        var league = await riotApi.LeagueV4.bySummoner(summoner.json.id, 'kr');
        var games = await riotApi.MatchV4.byAccount(summoner.json.accountId, 'kr');
        console.log(games);
    }
    else {
        console.log('no user');
    }
}