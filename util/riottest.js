const riotApi = require('../lib/riot-api'); 

// for testing
const riot = require('../secure/riot.json');
const mytoken = riot['token'];

riotApi.SetGlobalConfig({token: mytoken, log: true});
// riotApi.SummonerName('유년이').then(data => {
//     console.log(data);
//     riotApi.LeagueSummonerId(data.id).then(ldata => {
//         console.log(ldata);
//     });
//     params = {
//         encryptedAccountId: data.accountId,
//         beginIndex: 1100
//     }
//     riotApi.MatchAccountId(params).then(ldata => {
//         console.log(ldata);
//     });
// }, err => {
//     console.log(err);
// });

var totalGolds = [];
var currentGolds = [];
var index = [];
riotApi.SummonerV4.byName('hideonbush', 'kr').then(data => {
    riotApi.GeneralReq.Query('/lol/match/v4/matchlists/by-account/', data.json.accountId, {beginIndex: 1100}, 'kr').then(rev => {
        var matches = rev.json.matches

        riotApi.GeneralReq.Query('/lol/match/v4/timelines/by-match/', matches[20].gameId, {}, 'kr').then(rrev => {
            for(i in rrev.json.frames) {
                var elem = rrev.json.frames[i];
                index.push(i+'min');
                totalGolds.push(elem.participantFrames['5'].totalGold);
                currentGolds.push(elem.participantFrames['5'].currentGold);
            }

            console.log(totalGolds, currentGolds, index)
        })
    })
});
