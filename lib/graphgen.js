module.exports.Gen = function (__, _begin, _end, _offset) {

    var lx = 0;
    var tx = 0;
    var monhtml = '';
    var period;
    if(_end === undefined) {
        _begin = new Date()
        _end = new Date(_begin - 31536000000);
        period = '???';
    } else {
        _begin = new Date(_begin - _offset);
        _end = new Date(_end - _offset);
        period = `${parseInt(_end / 1000)}~${parseInt(_begin / 1000)}`
    }

    var html = `
    <div id="user-graph">
    <div id="user-graph-header">
        <div>
            <span id="username-total">???</span><span id="username-period">${period}</span></div>
        <div></div>
        <form id="type-check" onchange='Change(false, "${__('game_count')}");'>
            <input type="checkbox" id="solo" name="Solo" value="solo" checked>
            <label for="solo">${__('ranked_solo')}</label>
            <input type="checkbox" id="flex" name="Flex" value="flex" checked>
            <label for="flex">${__('ranked_flex')}</label>
            <input type="checkbox" id="norm" name="Norm" value="norm" checked>
            <label for="norm">${__('normal')}</label>
            <input type="checkbox" id="aram" name="Aram" value="aram" checked>
            <label for="aram">${__('aram')}</label>
            <input type="checkbox" id="urf" name="URF" value="urf" checked>
            <label for="urf">URF</label>
            <input type="checkbox" id="ai" name="AI" value="ai" checked>
            <label for="ai">${__('ai')}</label>
            <input type="checkbox" id="etc" name="etc" value="etc" checked>
            <label for="etc">${__('etc')}</label>
        </form>
    </div>
    <div id="user-graph-svg">
    <svg class="graph-svg">
    <symbol id="graph-sizing">
        <g transform="translate(30, 30)">
            <g transform="translate(0, 0)">`;

    var ctime = new Date(_end);
    _begin = new Date(_begin - 86400000);
    
    while(true) {
        var cs = ctime.toISOString().slice(0, 10);
        var day = ctime.getUTCDay();
        
        var ly = day * 20;
        html += `<a onclick="$('#user-games-refresh').attr('date', '${cs}');Change(false, '${__('game_count')}');" style="cursor:pointer;"><rect id="rect-${cs}" class="day" title="???${__('game_count')}, ${cs}" width="16" height="16" rx="3" x=${lx} y=${ly} style="stroke: #e2e4e7; fill: #ebedf0" data-date=${cs}></rect></a>`


        // Month tag
        if(ctime.getDate() === 15) {
            monhtml += `<text x=${tx + lx + 20} y="-7" class="month">${__('month_' + ctime.getMonth())}</text>`
        }

        if(ctime <= _begin) {
            if(day == 6) {
                lx--;
                tx += 20;
                html += `</g><g transform="translate(${tx}, 0)">`
            }

            ctime = new Date(ctime - (-86400000));
        } else {
            html += `</g>`;
            break;
        }
    }
    
    html += monhtml;
    html += `
        <text text-anchor="start" class="wday wday-point" dx="-10" dy="15">${__('sunday')}</text>
        <text text-anchor="start" class="wday wday-simple" dx="-10" dy="35">${__('monday')}</text>
        <text text-anchor="start" class="wday" dx="-10" dy="55">${__('tuesday')}</text>
        <text text-anchor="start" class="wday wday-simple" dx="-10" dy="75">${__('wednesday')}</text>
        <text text-anchor="start" class="wday" dx="-10" dy="95">${__('thursday')}</text>
        <text text-anchor="start" class="wday wday-simple" dx="-10" dy="115">${__('friday')}</text>
        <text text-anchor="start" class="wday wday-point" dx="-10" dy="135">${__('saturday')}</text>
    </g>
    </symbol>
    </svg>`;

    html += `<svg id="graph-viewbox" viewBox="0 0 1060 170" width="100%">
    <use xlink:href="#graph-sizing"/>
  </svg></div></div>`;

    return html;
}
