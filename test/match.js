const origin = require('./5048836327.json')
const { CHAMPION, RIOTCDNURI, SPELL, RUNE } = require('./const');
const fs = require('fs');

var teams = {};

for (elem of origin.teams) {
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

var team1 = {
    html: '<ul class="team-container">',
    kills: 0,
    deaths: 0,
    assists: 0,
    gold: 0,
    damage: 0,
    participants: []
}
var team2 = {
    html: '<ul class="team-container">',
    kills: 0,
    deaths: 0,
    assists: 0,
    gold: 0,
    damage: 0,
    participants: []
}

var ids = {};
for (elem of origin.participantIdentities) {
    ids[elem.participantId] = {
            name: elem.player.summonerName,
            accountId: elem.player.currentAccountId,
            platform: elem.player.currentPlatformId
    }
}

for (elem of origin.participants) {
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
    var partHtml = `<li class="team-part">
    <div class="part-champ cell">
        <div class="part-icon">
            <img src="${RIOTCDNURI}/img/champion/${CHAMPION[elem.championId]}.png" alt="${CHAMPION[elem.championId]}" title="${CHAMPION[elem.championId]}" />
            <span>${elem.stats.champLevel}</span>
        </div>
        <div class="part-spell">
            <img src="${RIOTCDNURI}/img/spell/${SPELL[elem.spell1Id]}.png" />
            <img src="${RIOTCDNURI}/img/spell/${SPELL[elem.spell2Id]}.png" />
        </div>
        <div class="part-rune">
            <img src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.perk0]}" />
            <img src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.perkSubStyle]}" />
        </div>
    </div>
    <div class="part-name cell">
        <span>${ids[elem.participantId].name}</span>
    </div>
    <div class="part-item cell">
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item0}.png" />
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item1}.png" />
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item2}.png" />
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item3}.png" />
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item4}.png" />
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item5}.png" />
        <img src="${RIOTCDNURI}/img/item/${elem.stats.item6}.png" />
    </div>
    <div class="part-kda cell">
        <span>${elem.stats.kills}/${elem.stats.deaths}/${elem.stats.assists} (56%)</span>
    </div>
    <div class="part-cs cell">
        <span title="${elem.stats.totalMinionsKilled} + ${elem.stats.neutralMinionsKilled}">${elem.stats.totalMinionsKilled + elem.stats.neutralMinionsKilled}</span>
    </div>
    <div class="part-gold cell">
        <span>${elem.stats.goldEarned}</span>
    </div>
    <div class="part-damage cell">
        <span title="${elem.stats.totalDamageDealtToChampions}/${elem.stats.totalDamageDealt}">${elem.stats.totalDamageDealtToChampions}</span>
    </div>
</li>`;
    if(elem.teamId === 100) {
        team1.html += partHtml + '</ul>';
        team1.kills += participant.stats.kills;
        team1.deaths += participant.stats.deaths;
        team1.assists += participant.stats.assists;
        team1.gold += participant.stats.goldEarned;
        team1.damage += participant.stats.deal;
    }else {
        team2.html += partHtml + '</ul>';
        team2.kills += elem.stats.kills;
        team2.deaths += elem.stats.deaths;
        team2.assists += elem.stats.assists;
        team2.gold += elem.stats.goldEarned;
        team2.damage += elem.stats.totalDamageDealtToChampions;
    }

    teams[elem.teamId].participants.push(participant)
    teams[elem.teamId].kills += participant.stats.kills;
    teams[elem.teamId].deaths += participant.stats.deaths;
    teams[elem.teamId].assists += participant.stats.assists;
    teams[elem.teamId].gold += participant.stats.gold;
    teams[elem.teamId].damage += participant.stats.deal;
}

team1.html = `<link rel="stylesheet" href="./match.css" />
<div class="match">
    <div class="team win">
        <header class="team-header">
            <div class="col-champ cell">승리(파랑팀)</div>
            <div class="col-name cell">${team1.kills}/${team1.deaths}/${team1.assists}</div>
            <div class="col-item cell">${team1.gold}</div>
            <div class="col-kda cell">K/D/A</div>
            <div class="col-cs cell">cs</div>
            <div class="col-gold cell">gold</div>
            <div class="col-damage cell">damage</div>
        </header>
        ${team1.html}
    </div>
</div>`;

fs.writeFile('./test/test.html', team1.html, err => {
    console.log(err);
})
fs.writeFile('./test/test.json', JSON.stringify(teams), err => {
    console.log(err);
})