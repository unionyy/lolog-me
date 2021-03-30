/** Generate Game Log from Game Data with timestamp (Just Make Data for Log) */

const { QUEUETYPE, CHAMPION, PLATFORM_MY, LANES } = require('./constant');


module.exports.Gen = function (_gameData, __, _nonce) {

    if (!_gameData) {
        return '<div id="user-games"><div id="user-games-header"><h2>No Game</h2></div></div>';
    }

    var html =
        `<div id="user-games">
        <div id="user-games-header">
            <span id="user-games-number">${_gameData.length}${__('game_count')}</span>
            <span id="user-games-refresh" date="all">${__('show_all')}</span>
            <i class="fa fa-caret-up"></i>
            <i class="fa fa-caret-down" style="display: none;"></i>
        </div>
        <div id="user-games-body" class="in-box">
            <div id="user-games-recent">
                <div id="games-recent-charts">
                    <span id="recent-victory"></span>
                    <div id="chart-victory-wrapper">
                        <div id="chart-victory"></div>
                        <div id="chart-victory-text"><span id="chart-victory-span"></span></div>
                    </div>
                    <div id="victory-team"></div>
                    <div id="victory-duration"></div>
                </div>
                <div id="recent-log-wrapper">
                    <div id="games-recent-log">
                    </div>
                    <div id="recent-more">
                        <i class="fa fa-plus icon-more" aria-hidden="true"></i>
                        <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw icon-more-wait hide" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div id="user-games-all">
                <script nonce="${_nonce}">
                    const logArray = [`;

    /** Make Array for Log Make Log Icon */
    _gameData.forEach(game => {
        var timestamp = game.play_time;
        if (timestamp.toISOString) {
            timestamp = parseInt(timestamp / 1000);
        }

        /** Catch Undefined Gametype */
        var queueType = QUEUETYPE[game.queue_type];
        if (!queueType) {
            console.log(game.queue_type);
            queueType = 'etc';
        }

        /** Send Array for reduce text */
        // html += `{
        //     platform: "${Object.keys(PLATFORM_MY)[game.platform_my]}",
        //     matchId: "${game.game_id}",
        //     timestamp: "${timestamp}",
        //     queue: "${queueType}",
        //     champion: ${game.champion},
        //     lane: "${LANES[game.lane_my]}",
        // }, `
        html += `["${Object.keys(PLATFORM_MY)[game.platform_my]}",${game.game_id},${timestamp},"${queueType}",${game.champion},"${LANES[game.lane_my]}"],`
    })
    html = html.slice(0, -1);
    html += `];
        </script>
        </div></div>
    </div>`
    return html;
}