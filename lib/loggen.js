/** Generate Game Log from Game Data with timestamp */

const { QUEUETYPE } = require('./constant');

module.exports.Gen = function(_gameData) {

    if(!_gameData) {
        return '<div id="user-games"><div id="user-games-header"><h2>No Game</h2></div></div>';
    }

    var start = _gameData[_gameData.length - 1].play_time;
    if(start.toISOString) {
        start = parseInt(start / 1000);
    }

    var end = _gameData[0].play_time;
    if(end.toISOString) {
        end = parseInt(end / 1000);
    }

    var html =
    `<div id="user-games">
        <div id="user-games-header">
            <span id="user-games-number">${_gameData.length}판</span>
            <span id="user-games-period">${start}~${end}</span>
            <span id="user-games-refresh" date="all" onclick="$('#user-games-refresh').attr('date', 'all');Change();">전체보기</span>
        </div>
        <div id="user-games-body">`;
    _gameData.forEach(game => {
        var timestamp = game.play_time;
        if(timestamp.toISOString) {
            timestamp = parseInt(timestamp / 1000);
        }

        html +=
        `<a class="user-games-game" href="/match/${game.game_id}" target="_blank" rel="noopener noreferrer" timestamp="${timestamp}" gametype="${QUEUETYPE[game.queue_type]}">
            <img class="user-games-icon" src="https://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/Nunu.png">
            <span class="user-games-date">???</span><br>
            <span class="user-games-type">${QUEUETYPE[game.queue_type]}</span>
        </a>
        `;

        /** Catch Undefined Gametype */
        if(!QUEUETYPE[game.queue_type]) {
            console.log(game.queue_type);
        }
    })
    html += `</div></div>`
    return html;
}