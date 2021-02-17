/** Generate Game Log from Game Data with timestamp */

const { QUEUETYPE, CHAMPION, PLATFORM_MY } = require('./constant');

module.exports.Gen = function(_gameData, __) {

    if(!_gameData) {
        return '<div id="user-games"><div id="user-games-header"><h2>No Game</h2></div></div>';
    }

    var html =
    `<div id="user-games">
        <div id="user-games-header">
            <span id="user-games-number">${_gameData.length}${__('game_count')}</span>
            <span id="user-games-period">???</span>
            <span id="user-games-refresh" date="all" onclick="$('#user-games-refresh').attr('date', 'all');Change(false, '${__('game_count')}');">${__('show_all')}</span>
            <i class="fa fa-caret-up" onclick="HideLog();"></i>
            <i class="fa fa-caret-down" onclick="ShowLog();" style="display: none;"></i>
        </div>
        <div id="user-games-body" class="in-box">`;
    _gameData.forEach(game => {
        var timestamp = game.play_time;
        if(timestamp.toISOString) {
            timestamp = parseInt(timestamp / 1000);
        }

        /** Catch Undefined Gametype */
        var queueType = QUEUETYPE[game.queue_type];
        if(!queueType) {
            console.log(game.queue_type);
            queueType = 'etc';
        }

        //var url = `/${Object.keys(PLATFORM_MY)[game.platform_my]}/match/${game.game_id}`;
        var url = `https://matchhistory.kr.leagueoflegends.com/#match-details/${Object.keys(PLATFORM_MY)[game.platform_my].toUpperCase()}/${game.game_id}?tab=overview`;
        html +=
        `<a class="user-games-game" href="${url}" target="_blank" rel="noopener noreferrer" timestamp="${timestamp}" gametype="${queueType}">
            <img class="user-games-icon" src="https://ddragon.leagueoflegends.com/cdn/11.3.1/img/champion/${CHAMPION[game.champion]}.png">
            <span class="user-games-date">???</span><br>
            <span class="user-games-type">${__('icon_'+ queueType)}</span>
        </a>
        `;
    })
    html += `</div></div>`
    return html;
}