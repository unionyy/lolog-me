const api = require("./lib/riot-api");
const { token } = require("./secure/riot.json");

async function test() {
    // Init
    const config = { token   : token };
    api.SetGlobalConfig(config);

    // search summoner
    const name = await api.SummonerV4.byName('유년이', 'kr');
    if(name.code !== 200) {
        console.log(name);
        return;
    }

    const puuid = name.json.puuid;
    const summoner = name.json.id;

    // search league
    const league = await api.LeagueV4.bySummoner(summoner, 'kr');
    if(league.code !== 200) {
        console.log(league);
        return;
    }

    // search match list
    const matchlist = await api.MatchV5.byPUUID(puuid, { start: 10, count: 7 }, 'kr');
    if(matchlist.code !== 200) {
        console.log(matchlist);
        return;
    }

    const matchId = Number(matchlist.json[1].slice(3));

    //search match
    const match = await api.MatchV5.matches(matchId, 'kr');

    console.log(match);
}

test();