/** Generate Game Log from Game Data with timestamp (Just Make Data for Log) */

const { QUEUETYPE, CHAMPION, PLATFORM_MY, LANES } = require('./constant');


module.exports.Gen = function(_gameData, __) {

    if(!_gameData) {
        return '<div id="user-games"><div id="user-games-header"><h2>No Game</h2></div></div>';
    }

    var html =
    `<div id="user-games">
        <div id="user-games-header">
            <span id="user-games-number">${_gameData.length}${__('game_count')}</span>
            <span id="user-games-refresh" date="all" onclick="$('#user-games-refresh').attr('date', 'all');Change(false, '${__('game_count')}');">${__('show_all')}</span>
            <i class="fa fa-caret-up" onclick="HideLog();"></i>
            <i class="fa fa-caret-down" onclick="ShowLog();" style="display: none;"></i>
        </div>
        <div id="user-games-body" class="in-box">
            <script>
                const logArray = [`;

    /** Make Array for Log Make Log Icon */
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

        html += `["${Object.keys(PLATFORM_MY)[game.platform_my].toUpperCase()}/${game.game_id}", "${timestamp}", "${queueType}", "${CHAMPION[game.champion]}", "${LANES[game.lane_my]}", "${__(CHAMPION[game.champion])}"],`;
    })
    html = html.slice(0, -1);
    html += `];
        </script>
    </div></div>`
    return html;
}