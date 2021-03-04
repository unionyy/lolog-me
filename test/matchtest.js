const { CHAMPION } = require('../lib/constant');
const riotApi = require('../lib/riot-api'); 

// for testing
const riot = require('../secure/riot.json');
const mytoken = riot['token'];

riotApi.SetGlobalConfig({token: mytoken, log: true});
var gameId = '5024381732';
var platform = 'kr';

riotApi.MatchV4.matches(gameId, platform).then(data => {
    var winner = 'no';
    var games = [];
    var playTime = data.json.gameCreation;
    var queueType = data.json.queueId
    for(team of data.json.teams) {
        if(team.win === 'Win') {
            if(team.teamId === 100) {
                winner = 'blue';
            } else {
                winner = 'red';
            }
        }
    }

    for(part of data.json.participants) {
        var game = {
            champion: part.championId,
            lane: part.timeline.lane,
            role: part.timeline.role,
        }
        games[part.participantId] = game;
    }

    for(partId of data.json.participantIdentities) {
        games[partId.participantId].accountId = partId.player.currentAccountId;
    }

    console.log(games);
})
