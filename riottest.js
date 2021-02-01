const riotApi = require('./libs/riot-api'); 

// for testing
const riot = require('./secure/riot.json');
const mytoken = riot['token'];

riotApi.SetGlobalConfig({token: mytoken, log: false, platform: 'kr'});
riotApi.SummonerName('유년이').then(data => {
    console.log(data);
    riotApi.LeagueSummonerId(data.id).then(ldata => {
        console.log(ldata);
    });
    params = {
        encryptedAccountId: data.accountId,
        beginIndex: 1100
    }
    riotApi.MatchAccountId(params).then(ldata => {
        console.log(ldata);
    });
}, err => {
    console.log(err);
});