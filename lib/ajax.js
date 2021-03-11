module.exports.Match = function (_origin) {
    var teams = {};

    /** Retry if duration < 5min */
    var isRetry = false;
    if(_origin.gameDuration < 301) {
        isRetry = true;
    }

    for (elem of _origin.teams) {
        teams[elem.teamId] = {
            win: elem.win,
            kills: 0,
            deaths: 0,
            assists: 0,
            gold: 0,
            damage: 0,
            participants: []
        }
    }

    var ids = {};
    for (elem of _origin.participantIdentities) {
        ids[elem.participantId] = {
            name: elem.player.summonerName,
            accountId: elem.player.currentAccountId,
            platform: elem.player.currentPlatformId
        }
    }

    for (elem of _origin.participants) {
        var participant = {
            id: ids[elem.participantId],
            champ: elem.championId,
            spell1Id: elem.spell1Id,
            spell2Id: elem.spell2Id,
            stats: {
                champLevel: elem.stats.champLevel,
                rune0: elem.stats.perk0,
                rune1: elem.stats.perkSubStyle,
                item0: elem.stats.item0,
                item1: elem.stats.item1,
                item2: elem.stats.item2,
                item3: elem.stats.item3,
                item4: elem.stats.item4,
                item5: elem.stats.item5,
                item6: elem.stats.item6,
                kills: elem.stats.kills,
                deaths: elem.stats.deaths,
                assists: elem.stats.assists,
                minions: elem.stats.totalMinionsKilled,
                jungle: elem.stats.neutralMinionsKilled,
                gold: elem.stats.goldEarned,
                deal: elem.stats.totalDamageDealtToChampions,
                dealTotal: elem.stats.totalDamageDealt
            }
        }

        teams[elem.teamId].participants.push(participant)
        teams[elem.teamId].kills += participant.stats.kills;
        teams[elem.teamId].deaths += participant.stats.deaths;
        teams[elem.teamId].assists += participant.stats.assists;
        teams[elem.teamId].gold += participant.stats.gold;
        teams[elem.teamId].damage += participant.stats.deal;
    }
    
    for (teamId in teams) {
        var win = 0;
        if(teamId === 100) {
            /** Blue team */
            win += 10;
        } else if(teamId === 200) {
            /** Red team */
            win += 20;
        }

        if (isRetry) {
            win += 3;
            teams[teamId].win = 'Retry';
        } else if(teams[teamId].Win === 'Win') {
            win += 1;
        } else if(teams[teamId].Win === 'Fail') {
            win += 2;
        }

        /** Add games on DB */
        /****************** */
    
        for (participant of teams[teamId].participants) {
            //participant.name = participant.id.name;
            // delete participant.id;
        }
        
    }

    return teams;
}