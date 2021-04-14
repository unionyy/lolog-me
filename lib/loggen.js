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
                    <span id="recent-victory" class="recent-chart-text"></span>
                    <div id="chart-victory-wrapper">
                        <div id="chart-victory"></div>
                        <div id="chart-victory-text"><span id="chart-victory-span"></span></div>
                    </div>
                    <span class="recent-chart-text margin-top">${__('team_rate')}</span>
                    <div id="victory-team"></div>
                    <span class="recent-chart-text margin-top">${__('duration_rate')}</span>
                    <div id="victory-duration"></div>
                    <span class="recent-chart-text margin-top">KDA</span>
                    <div id="recent-sum" class="recent-kda recent-cell">
                        <div class="recent-kda-kda">
                            <span id="kda-sum-k" class="text-kda kda-sum">0</span>
                            <span>/</span><span id="kda-sum-d" class="text-kda kda-sum">0</span>
                            <span>/</span><span id="kda-sum-a" class="text-kda kda-sum">0</span>
                            <img class="icon-inline" src="/images/icon/mask-icon-offense.png" />
                        </div>
                        <div class="recent-score">
                            <span class="text-score-lang">${__('score')}</span>
                            <span id="score-sum" class="text-score">0.00</span> 
                        </div>
                        <div class="recent-part">
                            <span class="text-part-lang">${__('part')}</span>
                            <span id="part-sum" total-kill="0" class="text-killpart">0 %</span>
                        </div>
                    </div>
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
        <div id="item-tooltips"></div>
        <div id="spell-tooltips"></div>
        <div id="rune-tooltips"></div>
    </div>`
    return html;
}