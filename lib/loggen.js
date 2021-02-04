const TYPESKR = {
    Solo : '솔랭', // 솔랭
    Flex : '자랭', // 자랭
    Norm : '일반', // 일반
    ARAM : '칼바람', // 칼바람
    URF  : 'URF', // 우루프
    AI   : 'AI대전'  // 봇전
}

const QUEUETYPE = {
    420: 'solo',
    430: 'norm',
    440: 'flex',
    450: 'aram',
    830: 'ai',
    840: 'ai',
    850: 'ai',
    900: 'urf',
    1020: 'ofa'
}

const TIMEZONE = {
    0: -32400000 // kr
}


module.exports.Gen = function(_gameData) {

    var start = _gameData[_gameData.length - 1].play_time;
    if(!start.toISOString) {
        start = new Date(start * 1000);
    }
    start = start.toISOString().slice(0, 10);

    var end = _gameData[0].play_time;
    if(!end.toISOString) {
        end = new Date(end * 1000);
    }
    end = end.toISOString().slice(0, 10);
    var html =
    `<div id="user-games">
        <div id="user-games-header">
            <span id="user-games-number">${_gameData.length}판</span>
            <span id="user-games-period"> (${start}~${end})</span>
            <span id="user-games-refresh" date="all" onclick="$('#user-games-refresh').attr('date', 'all');Change();">전체보기</span>
        </div>
        <div id="user-games-body">`;
    _gameData.forEach(game => {
        var date = game.play_time;
        if(!date.toISOString) {
            date = new Date(date * 1000);
        }
        date = (new Date(date - TIMEZONE[game.platform_my])).toISOString().slice(0, 10);

        html +=
        `<a class="user-games-game" href="https://your.gg/kr/profile/test/match/${game.game_id}" target="_blank" rel="noopener noreferrer" date="${date}" gametype="${QUEUETYPE[game.queue_type]}" title="${date}, ${QUEUETYPE[game.queue_type]}">
            <img class="user-games-icon" src="https://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/${game.champion}.png">
            <span class="user-games-date">${date.slice(5)}</span><br>
            <span class="user-games-type">${QUEUETYPE[game.queue_type]}</span>
        </a>
        `;
    })
    html += `</div></div>`
    return html;
}