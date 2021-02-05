module.exports.Gen = function (__) {
    const time = new Date();
    var ctime = new Date(time - 31622400000);
    var html = `
    <div id="user-graph-svg">
    <svg class="graph-svg">
    <symbol id="graph-sizing">
        <g transform="translate(30, 30)">
            <g transform="translate(0, 0)">`;
    var lx = 0;
    var tx = 0;
    var monhtml = '';
    for (var i = 0; i <= 367; i++) {
        var cs = ctime.toISOString().slice(0, 10);
        var day = ctime.getDay();
        
        var ly = day * 20;
        html += `<a onclick="$('#user-games-refresh').attr('date', '${cs}');Change(false, '${__('game_count')}');" style="cursor:pointer;"><rect id="rect-${cs}" class="day" title="???${__('game_count')}, ${cs}" width="16" height="16" rx="3" x=${lx} y=${ly} style="stroke: #e2e4e7; fill: #ebedf0" data-date=${cs}></rect></a>`


        // Month tag
        if(ctime.getDate() === 15) [
            monhtml += `<text x=${tx + lx + 20} y="-7" class="month">${__('month_' + ctime.getMonth())}</text>`
        ]

        if(i == 367) {
            html += `</g>`;
        }else if(day == 6) {
            lx--;
            tx += 20;
            html += `</g><g transform="translate(${tx}, 0)">`
        }


        ctime = new Date(ctime - (-86400000)); //(-24) * 3600 * 1000

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
  </svg></div>`;

    return html;
}
