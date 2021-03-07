const origin = require('./5048836327.json')
const { CHAMPION, RIOTCDNURI, SPELL, RUNE } = require('./const');
const fs = require('fs');

var team1 = {
    html: '<ul class="team-container">',
    kills: 0,
    deaths: 0,
    assists: 0,
    gold: 0,
    damage: 0
}
var team2 = {
    html: '<ul class="team-container">',
    kills: 0,
    deaths: 0,
    assists: 0,
    gold: 0,
    damage: 0
}

var names = {};
for (elem of origin.participantIdentities) {
    names[elem.participantId] = elem.player.summonerName;
}

for (elem of origin.participants) {
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
        <span>${names[elem.participantId]}</span>
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
        team1.kills += elem.stats.kills;
        team1.deaths += elem.stats.deaths;
        team1.assists += elem.stats.assists;
        team1.gold += elem.stats.goldEarned;
        team1.damage += elem.stats.totalDamageDealtToChampions;
    }else {
        team2.html += partHtml + '</ul>';
        team2.kills += elem.stats.kills;
        team2.deaths += elem.stats.deaths;
        team2.assists += elem.stats.assists;
        team2.gold += elem.stats.goldEarned;
        team2.damage += elem.stats.totalDamageDealtToChampions;
    }
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