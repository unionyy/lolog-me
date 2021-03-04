const { CHAMPION } = require('../lib/constant');
const riotApi = require('../lib/riot-api'); 

// for testing
const riot = require('../secure/riot.json');
const mytoken = riot['token'];

function FindPosition(_lane, _role) {
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
    return position;
}

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
riotApi.SummonerV4.byName('카타탑', 'kr').then(data => {
    console.log(data);
    riotApi.GeneralReq.Query('/lol/match/v4/matchlists/by-account/', data.json.accountId, {beginIndex: 100}, 'kr').then(rev => {
        var matches = rev.json.matches
        for(elem of matches) {
            if((elem.queue === 420 || elem.queue === 430  || elem.queue === 400  || elem.queue === 440) && CHAMPION[elem.champion] === 'Katarina' ) {
                console.log(elem.lane, elem.role, CHAMPION[elem.champion], elem.gameId);
            }
            
        }
        // riotApi.GeneralReq.Query('/lol/match/v4/matches/', matches[20].gameId, {}, 'kr').then(rrev => {
        //     console.log(rrev.json.participants[7].timeline);
        // })
        // riotApi.GeneralReq.Query('/lol/match/v4/timelines/by-match/', matches[20].gameId, {}, 'kr').then(rrev => {
        //     for(i in rrev.json.frames) {
        //         var elem = rrev.json.frames[i];
        //         index.push(i+'min');
        //         totalGolds.push(elem.participantFrames['5'].totalGold);
        //         currentGolds.push(elem.participantFrames['5'].currentGold);
        //     }

        //     console.log(rrev.json.frames[10].participantFrames['4'])
        // })
    })
});
