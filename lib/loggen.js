const { QUEUETYPE } = require('./constant');


module.exports.Gen = function(_gameData) {

    var start = _gameData[_gameData.length - 1].play_time;
    if(!start.toISOString) {
        start = new Date(start * 1000);
    }

    var end = _gameData[0].play_time;
    if(!end.toISOString) {
        end = new Date(end * 1000);
    }

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

        html +=
        `<a class="user-games-game" href="https://your.gg/kr/profile/test/match/${game.game_id}" target="_blank" rel="noopener noreferrer" date="${date}" gametype="${QUEUETYPE[game.queue_type]}" title="${date}, ${QUEUETYPE[game.queue_type]}">
            <img class="user-games-icon" src="https://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/Nunu.png">
            <span class="user-games-date">${date}</span><br>
            <span class="user-games-type">${QUEUETYPE[game.queue_type]}</span>
        </a>
        `;
    })
    html += `</div></div>`
    return html;
}