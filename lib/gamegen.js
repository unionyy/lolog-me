const TYPESKR = {
    Solo : '솔랭', // 솔랭
    Flex : '자랭', // 자랭
    Norm : '일반', // 일반
    ARAM : '칼바람', // 칼바람
    URF  : 'URF', // 우루프
    AI   : 'AI대전'  // 봇전
}

module.exports.Gen = function(games, start, end) {
    var html =
    `<div id="user-games">
        <div id="user-games-header">
            <span id="user-games-number">${games.length}판</span>
            <span id="user-games-period"> (${start}~${end})</span>
            <span id="user-games-refresh" date="all" onclick="$('#user-games-refresh').attr('date', 'all');Change();">전체보기</span>
        </div>
        <div id="user-games-body">`;
    games.forEach(game => {

        html +=
        `<a class="user-games-game" href="https://your.gg/kr/profile/${game.username}/match/${game.game_id}" target="_blank" rel="noopener noreferrer" date="${game.playdate}" gametype="${game.type.toLowerCase()}" title="${game.playdate}, ${TYPESKR[game.type]}">
            <img class="user-games-icon" src="https://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${game.champ}">
            <span class="user-games-date">${game.playdate.slice(5)}</span><br>
            <span class="user-games-type">${TYPESKR[game.type]}</span>
        </a>
        `;
    })
    html += `</div></div>`
    return html;
}