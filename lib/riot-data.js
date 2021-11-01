/*************  lib/riot-data.js *************
 * 
 * Get Game Data from DB or Riot API
 * Parse API data & INSERT to DB
 * 
 * Return json type object data
 * 
 **** export functions ****
 * Init
 * 
 * SearchSummonerName
 * SearchSummonerIdMy
 * UpdateSummoner
 * 
 * SearchMatchList
 * SearchMatches
 * SearchMatchDetail
 * 
 ********************************************/


const { PLATFORM_MY, POSITION_MY, PLATFORMS } = require('./constant');

const riotApi = require('./riot-api'); 
const dbio = require('./dbio');
const { NormalizeName } = require('./util');


var searchQ = {};

/* Initialize DB-IO & RIOT API Server Check  (Called before use) */
module.exports.Init = async function() {
    await dbio.Init();

    riotApi.SetGlobalConfig({
        log: false
    });

    /* Test Riot API */
    const data = await riotApi.LOLSTATUSV4.platformData('kr');

    if(data.code === 200) {
        console.log('Riot API working...!');
    }
    else {
        console.log('Riot API not working...');
        console.log(data.json);
    }
}

/* Search Summoner by Name */
module.exports.SearchSummonerName = async function(_normName, _platform) {
    const dbSummoner = await dbio.GetSummonerByName(_normName, PLATFORM_MY[_platform]);
    // DB Hit
    if(dbSummoner) return dbSummoner;
    // DB Miss
    else {
        const apiSummoner = await SearchSummonerAPI(_normName, _platform);
        // Summoner Not Found
        if(!apiSummoner) return false;

        // API Hit
        const dbSummonerPUUID = await dbio.GetSummonerByPUUID(apiSummoner.puuid);
        if(dbSummonerPUUID) {
            // Summoner Name Changed
            if(await dbio.UpdateSummoner(apiSummoner)) return await dbio.GetSummonerByName(_normName, PLATFORM_MY[_platform]);
            // DB Update Error
            return false;
        }

        // New Summoner
        if(await dbio.InputSummoner(apiSummoner)) return await dbio.GetSummonerByName(_normName, PLATFORM_MY[_platform]);
        // DB Insert Error
        return false;
    }
};

/* Update Summoner by idMy */
module.exports.UpdateSummoner = async function(_idMy, _til) {
    const dbSummoner = await dbio.GetSummonerByidMy(_idMy);

    // DB Miss (No Summoner)
    if(!dbSummoner) return false;

    // 1 Minute term
    if(dbSummoner.update_time > new Date() - _til) {
        return dbSummoner;
    }

    // DB Hit
    const apiSummoner = await SearchSummonerAPI("", PLATFORMS[dbSummoner.platform_my], dbSummoner.puuid);

    // Summoner Not Found
    if(!apiSummoner) return false;

    // Update Summoner
    if(await dbio.UpdateSummoner(apiSummoner)) return apiSummoner;
    // DB Insert Error
    return false;
};

async function SearchSummonerAPI (_normName, _platform, _puuid = -1) {
    let summoner;

    /** Search by Name */
    if(_puuid == -1) {
        let searchName = _normName
        if(searchName.length === 2) {
            let addBlank = searchName[0];
            addBlank += ' ';
            addBlank += searchName[1];
            searchName = addBlank;
        }
        summoner = await riotApi.SummonerV4.byName(searchName, _platform);
        if(summoner.code !== 200) {
            console.log('no user', summoner.code);
            return false;
        }
    }
    /** Search by PUUID */
    else {
        summoner = await riotApi.SummonerV4.byPUUID(_puuid, _platform);
        if(summoner.code !== 200) {
            console.log('no user', summoner.code);
            return false;
        }
        _normName = NormalizeName(summoner.json.name);
    }
    
    
    let solo = {};
    let flex = {};
    const league = await riotApi.LeagueV4.bySummoner(summoner.json.id, _platform);
    if(league.code === 200) {
        for(const elem of league.json) {
            if(elem.queueType === 'RANKED_SOLO_5x5') {
                solo = elem;
            } else if(elem.queueType === 'RANKED_FLEX_SR') {
                flex = elem;
            }
        }
    }

    return {
        norm_name: _normName,
        platform_my: PLATFORM_MY[_platform],

        account_id: summoner.json.accountId,
        summoner_id: summoner.json.id,
        puuid: summoner.json.puuid,

        summoner_name: summoner.json.name,
        profile_icon_id: summoner.json.profileIconId,
        summoner_level: summoner.json.summonerLevel,

        solo_tier: solo.tier || 'Unranked',
        solo_rank: solo.rank || 'none',
        solo_lp: solo.leaguePoints || 0,
        solo_wins: solo.wins || 0,
        solo_losses: solo.losses || 0,
        solo_mini_prog: solo.miniSeries?.progress || 'X',

        flex_tier: flex.tier || 'Unranked',
        flex_rank: flex.rank || 'none',
        flex_lp: flex.leaguePoints || 0,
        flex_wins: flex.wins || 0,
        flex_losses: flex.losses || 0,
        flex_mini_prog: flex.miniSeries?.progress || 'X'
    };
}


/* Search Summoner by id_my */
module.exports.SearchSummonerIdMy = async function(_id_my) {
    const dbSummoner = await dbio.GetSummonerByidMy(_id_my);
    // DB Hit
    if(dbSummoner) return dbSummoner;
    // DB Miss
    else return false;
};

/* Search Match List by PUUID from RIOT API ONLY */
module.exports.SearchMatchList = async function(_puuid, _platform) {
    const apiMatches = await riotApi.MatchV5.byPUUID(_puuid, { count: 100 }, _platform);
    if(apiMatches.code == 200) return apiMatches.json;
    else {
        console.log('no matches', apiMatches.code);
        return [];
    }
}

/* Search Matches by id_my and Match Ids */
module.exports.SearchMatches = async function(_idMy, _matchIds) {
    const matches = {};

    /** Parse matchIds */
    const matchIds = [];
    for(const matchId of _matchIds) {
        const splitedMatchId = matchId.split('_');
        matchIds.push({
            match_id:       splitedMatchId[1],
            platform:       splitedMatchId[0].toLowerCase(),
            platform_my:    PLATFORM_MY[splitedMatchId[0].toLowerCase()]
        });
    }

    /** Get Matches From DB */
    const dbMatches = await dbio.GetMatches(matchIds) || [];
    for(const match of dbMatches) matches[match.match_id] = match;

    /** Get Matches From Riot API */
    const dbMissMatchIds = [];
    for(const matchId of matchIds) if(!matches[matchId.match_id]) dbMissMatchIds.push(matchId);

    const matchPromises = [];
    const apiMatches = [];
    for(const matchId of dbMissMatchIds) matchPromises.push(SearchMatchAPI(matchId));
    for(const matchPromise of matchPromises) {
        const apiMatch = await matchPromise;
        if(apiMatch) apiMatches.push(apiMatch);
    }
    await DBInputMatchesWithParticipants(apiMatches);

    /** Get Remained Matches From DB */
    const dbRemainedMatches = await dbio.GetMatches(dbMissMatchIds) || [];
    for(const match of dbRemainedMatches) matches[match.match_id] = match;

    
    /** Get Participants From DB (Participants MUST Exist in DB */
    const dbParticipants = await dbio.GetParticipants(_idMy, matchIds);
    for(const participant of dbParticipants) {
        if(matches[participant.match_id])
            matches[participant.match_id].participant = participant;
    }

    return matches;
}

async function SearchMatchAPI(_matchId) {
    const matchId = _matchId.match_id;
    const platform = _matchId.platform;

    const match = await riotApi.MatchV5.matches(matchId, platform);

    if(match.code !== 200) {
        console.log('no match', match.code);
        return false;
    }

    /***** Parse Match *****/
    const teams = {};

    /** Retry if (Duration < 5 minute) */
    const matchInfo = match.json.info;
    
    /** gameDuration & gameEndTimestamp Before or After 11.20 */
    if(!matchInfo.gameEndTimestamp) matchInfo.gameDuration /= 1000;

    let isRetry = (matchInfo.gameDuration < 301);

    /** Initiate teams */
    for (const team of matchInfo.teams) {
        teams[team.teamId] = {
            win:        team.win,
            kills:      0,
            deaths:     0,
            assists:    0,
            gold_earned: 0,
            damage_champ: 0,
            participants: []
        }
    }

    /** Parse & Push Participants */
    for (const participant of matchInfo.participants) {
        teams[participant.teamId].participants.push({
            puuid:          participant.puuid,
            summoner_id:    participant.summonerId,
            summoner_name:  participant.summonerName,
            summoner_level: participant.summonerLevel,
            profile_icon_id: participant.profileIcon,

            champ_id:       participant.championId,
            champ_level:    participant.champLevel,
            spell1_id:      participant.summoner1Id, // spell1
            spell2_id:      participant.summoner2Id, // spell2
            rune_main_id:   participant.perks?.styles[0]?.selections[0]?.perk,
            rune_sub_style: participant.perks?.styles[1]?.style,
            position_my:    POSITION_MY[participant.teamPosition] || 0,

            kills:          participant.kills,
            deaths:         participant.deaths,
            assists:        participant.assists,
            item0:          participant.item0,
            item1:          participant.item1,
            item2:          participant.item2,
            item3:          participant.item3,
            item4:          participant.item4,
            item5:          participant.item5,
            item6:          participant.item6,
            minion_killed:  participant.totalMinionsKilled,
            jungle_killed:  participant.neutralMinionsKilled,
            gold_earned:    participant.goldEarned,
            damage_champ:   participant.totalDamageDealtToChampions,
            damage_total:   participant.totalDamageDealt,
            multi_kill:     participant.largestMultiKill,
            vision_score:   participant.visionScore,
            wards_bought:   participant.visionWardsBoughtIngame,
            wards_placed:   participant.wardsPlaced,
            wards_killed:   participant.wardsKilled,
            wards_placed_detector: participant.detectorWardsPlaced
        });

        /** Accumulate Team Stats */
        teams[participant.teamId].kills += participant.kills;
        teams[participant.teamId].deaths += participant.deaths;
        teams[participant.teamId].assists += participant.assists;
        teams[participant.teamId].gold_earned += participant.goldEarned;
        teams[participant.teamId].damage_champ += participant.totalDamageDealtToChampions;
    }

    /** Make win_my */
    for (const teamId in teams) {
        var winMy = parseInt(Number(teamId) / 10);
        if(isRetry) winMy += 3;
        else if(teams[teamId].win) winMy += 1;
        else winMy += 2;
        teams[teamId].win_my = winMy;
    }

    return {
        match_id:       matchId,
        platform_my:    PLATFORM_MY[platform],

        start_time:     parseInt(matchInfo.gameStartTimestamp / 1000),
        duration:       parseInt(matchInfo.gameDuration),
        queue_id:       matchInfo.queueId,
        teams:          teams
    }
}

async function DBInputMatchesWithParticipants(_matches) {
    const inputMatches = [];
    const inputParticipants = [];
    const puuids = [];
    const participantsMap = {};
    for(const match of _matches) {
        inputMatches.push(match);
        for(const teamId in match.teams) {
            const team = match.teams[teamId];
            for(const participant of team.participants) {
                participant.match_id =      match.match_id;
                participant.platform_my =   match.platform_my;
                participant.win_my =        team.win_my;
                participant.total_kills =   team.kills;
                inputParticipants.push(participant);
                puuids.push(participant.puuid);
                participantsMap[participant.puuid] = participant;
            }
        }
    }

    const matchesPromise = dbio.InputMatches(inputMatches);

    /** Check if Users Exist in DB */
    const existPUUIDs = await dbio.CheckSummonersByPUUID(puuids);
    const puuidMap = {};
    const inputSummoners = [];
    const freshPUUIDs = [];
    for(const existPUUID of existPUUIDs) puuidMap[existPUUID.puuid] = existPUUID.id_my;
    for(const puuid of puuids) {
        if(puuidMap[puuid] === undefined) {
            inputSummoners.push(participantsMap[puuid]);
            freshPUUIDs.push(puuid);
        }
    }

    /** INSERT SUMMONERS and GET ID_MY */
    await dbio.InputSummonersSimple(inputSummoners);
    const existFreshPUUIDs = await dbio.CheckSummonersByPUUID(freshPUUIDs);
    for(const freshPUUID of existFreshPUUIDs) puuidMap[freshPUUID.puuid] = freshPUUID.id_my;
    for(const participant of inputParticipants) participant.id_my = puuidMap[participant.puuid];

    await dbio.InputParticipants(inputParticipants);
    await matchesPromise;

    return;
}

/* Search Match Detail(Match & Participants) from DB ONLY */
module.exports.SearchMatchDetail = async function(_matchId) {
    const splitedMatchId = _matchId.split('_');
    const matchId = {
        match_id:       splitedMatchId[1],
        platform_my:    PLATFORM_MY[splitedMatchId[0].toLowerCase()]
    };

    const dbMatch = await dbio.GetMatches([matchId]);
    if(!dbMatch) return false;
    const dbParticipants = await dbio.GetParticipantsOfMatch(matchId);
    dbMatch[0].participants = dbParticipants;
    return dbMatch[0];
}