module.exports.Gen = function (__, _begin, _end, _periodHTML) {

    var endStr = '???';
    var beginStr = '???';

    if(_begin === '???') {
        _begin = new Date()
        _begin = new Date(new Date() - (-86400000))
    } else {
        _begin = new Date(_begin);
        beginStr = parseInt(_begin / 1000);
    }

    if(_end === '???') {
        _end = new Date(_begin - 31622400000);
    } else {
        _end = new Date(_end);
        endStr = parseInt(_end / 1000);
    }

    var html = `
    <div id="user-graph">
    <div id="user-graph-header">
        <div>
            <span id="username-total">???</span>
            <span class="period">(</span><span class="period" id="username-period-end">${endStr}</span>
            <span class="period">~</span>
            <span class="period" id="username-period-begin">${beginStr}</span><span class="period">)</span>
            <i class="fa fa-caret-up" onclick="HideSetting();"></i>
            <i class="fa fa-caret-down" onclick="ShowSetting();"></i>
        </div>
        <div></div>
        <form id="type-check" onchange='Change(false, "${__('game_count')}");'>
            <input type="checkbox" id="solo" name="Solo" value="solo" checked>
            <label for="solo">${__('ranked_solo')}</label>
            <input type="checkbox" id="flex" name="Flex" value="flex" checked>
            <label for="flex">${__('ranked_flex')}</label>
            <input type="checkbox" id="norm" name="Norm" value="norm" checked>
            <label for="norm">${__('normal')}</label>
            <input type="checkbox" id="aram" name="Aram" value="aram">
            <label for="aram">${__('aram')}</label>
            <input type="checkbox" id="urf" name="URF" value="urf">
            <label for="urf">URF</label>
            <input type="checkbox" id="ai" name="AI" value="ai">
            <label for="ai">${__('ai')}</label>
            <input type="checkbox" id="etc" name="etc" value="etc">
            <label for="etc">${__('etc')}</label>
        </form>
    </div>
    ${_periodHTML}
    <div id="user-graph-box" class ="in-box">
    <div id="user-graph-svg">
    <svg class="graph-svg">
    <symbol id="graph-sizing">
        <g id="graph-g" transform="translate(30, 30)">
        </g>
    </symbol>
    </svg>`;

    //var graphWidth = Math.ceil(days / 7) * 19 + 60;
    var graphWidth = 1048;

    var ratio = 98;

    html += `<svg id="graph-viewbox" viewBox="0 0 ${graphWidth} 170" width="${ratio}%">
    <use xlink:href="#graph-sizing"/>
    </svg></div>`
  
    html += `
    <div id="user-graph-grad">
    <svg id="graph-grad" width="320", height="18">
    <g transform="translate(0,0)">
        <text text-anchor="end" x="40" y="13" font-size="16px">Less</text>
        <text text-anchor="start" x="274" y="13" font-size="16px">More</text>
        <rect width="16" height="16" rx="3" x=50 y=0 style="stroke: #e2e4e7; fill: #ebedf0"></rect>
        <rect width="16" height="16" rx="3" x=70 y=0 style="stroke: 'none'; fill: #9be9a8"></rect>
        <rect width="16" height="16" rx="3" x=90 y=0 style="stroke: 'none'; fill: #6dd686"></rect>
        <rect width="16" height="16" rx="3" x=110 y=0 style="stroke: 'none'; fill: #40c463"></rect>
        <rect width="16" height="16" rx="3" x=130 y=0 style="stroke: 'none'; fill: #38b259"></rect>
        <rect width="16" height="16" rx="3" x=150 y=0 style="stroke: 'none'; fill: #30a14e"></rect>
        <rect width="16" height="16" rx="3" x=170 y=0 style="stroke: 'none'; fill: #216e39"></rect>
        <rect width="16" height="16" rx="3" x=190 y=0 style="stroke: 'none'; fill: #e99b9b"></rect>
        <rect width="16" height="16" rx="3" x=210 y=0 style="stroke: 'none'; fill: #c44040"></rect>
        <rect width="16" height="16" rx="3" x=230 y=0 style="stroke: 'none'; fill: #a13030"></rect>
        <rect width="16" height="16" rx="3" x=250 y=0 style="stroke: 'none'; fill: #6e2121"></rect>
    </g>
</svg>

        </div></div></div>`;

    return html;
}
