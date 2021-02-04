const { QUEUETYPE } = require('./constant');
const { TIMEZONE } = require('./constant');

module.exports.Gen = function (_data) {
    const time = new Date();
    var ctime = new Date(time - 365 * 24 * 3600 * 1000);
    var html = `
    <div id="user-graph-svg">
    <svg class="graph-svg">
    <symbol id="graph-sizing">
        <g transform="translate(30, 30)">
            <g transform="translate(0, 0)">`;
    var lx = 0;
    var tx = 0;
    var monhtml = '';
    var total = 0;
    var start = 0;
    var end = 0;
    for (var i = 0; i <= 366; i++) {
        var cs = ctime.toISOString().slice(0, 10);
        var day = ctime.getDay();
        
        var ly = day * 20;
        html += `<a onclick="$('#user-games-refresh').attr('date', '${cs}');Change();" style="cursor:pointer;"><rect class="day" title="???판, ${cs}" width="16" height="16" rx="3" x=${lx} y=${ly} style="stroke: #e2e4e7; fill: '#ebedf0'" data-date=${cs}></rect></a>`


        // Month tag
        if(ctime.getDate() === 15) [
            monhtml += `<text x=${tx + lx - 5} y="-7" class="month">${ctime.getMonth() + 1}월</text>`
        ]

        if(i == 366) {
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
        <text text-anchor="start" class="wday wday-point" dx="-10" dy="15">일</text>
        <text text-anchor="start" class="wday wday-simple" dx="-10" dy="35">월</text>
        <text text-anchor="start" class="wday" dx="-10" dy="55">화</text>
        <text text-anchor="start" class="wday wday-simple" dx="-10" dy="75">수</text>
        <text text-anchor="start" class="wday" dx="-10" dy="95">목</text>
        <text text-anchor="start" class="wday wday-simple" dx="-10" dy="115">금</text>
        <text text-anchor="start" class="wday wday-point" dx="-10" dy="135">토</text>
    </g>
    </symbol>
    </svg>`;

    html += `<svg id="graph-viewbox" viewBox="0 0 1060 170" width="100%">
    <use xlink:href="#graph-sizing"/>
  </svg></div>`;

    return {
        total: total,
        start: start,
        end: end,
        html: html
        };
}

function ParseData (_gameData) {
    var pDate = [];
    _gameData.forEach(elem => {
        var ds = elem.play_time;;
        if(!ds.toISOString) {
            ds = new Date(elem.play_time * 1000);
        }
        ds = (new Date(ds - TIMEZONE[elem.platform_my])).toISOString().slice(0, 10);
        
        if(pDate[ds]) {
            pDate[ds]['total']++;
            pDate[ds][QUEUETYPE[elem.queue_type]]++;
        } else {
            pDate[ds] = {
                total: 0,
                solo : 0, // 솔랭
                flex : 0, // 자랭
                norm : 0, // 일반
                aram : 0, // 칼바람
                urf  : 0, // 우루프
                ai   : 0  // 봇전
            }
            pDate[ds]['total']++;
            pDate[ds][QUEUETYPE[elem.queue_type]]++;
        }
    });
    return(pDate);
}
