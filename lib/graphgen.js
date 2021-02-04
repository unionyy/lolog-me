const { QUEUETYPE } = require('./constant');
const { TIMEZONE } = require('./constant');

module.exports.Gen = function (_data) {
    var pDate = [];
    if(_data) {
        pDate = ParseData(_data);
    }
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
    for (var i = 0; i <= 365; i++) {
        var faketime = new Date(ctime - TIMEZONE[_data[0].platform_my]); // TIMEZONE
        var cs = faketime.toISOString().slice(0, 10);
        var day = ctime.getDay();
        var play = {
            total: 0,
            solo : 0, // 솔랭
            flex : 0, // 자랭
            norm : 0, // 일반
            aram : 0, // 칼바람
            urf  : 0, // 우루프
            ai   : 0  // 봇전
        }
        if(pDate[cs]) {
            play = pDate[cs];
            if(play.total !== 0) {
                if(start === 0) {
                    start = cs;
                }
                end = cs;
            }
        }
        total += play.total;
        
        var color;
        var stroke;
        // Set Color
        switch (play.total) {
            case 0:
                color = '#ebedf0';
                stroke = '#e2e4e7'
                break;
            case 1:
            case 2:
            case 3:
                color = '#9be9a8';
                stroke = 'none';
                break;
            case 4:
            case 5:
            case 6:
                color = '#40c463';
                stroke = 'none';
                break;
            
            case 7:
            case 8:
            case 9:
                color = '#30a14e';
                stroke = 'none';
                break;
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
                color = '#216e39';
                stroke = 'none';
                break;
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
                color = '#1e2a22';
                stroke = 'none';
                break;
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
                color = '#88001b';
                stroke = 'none';
                break;
            default:
                color = '#ec1c24';
                stroke = 'none';
                break;
        }
        var ly = day * 20;
        html += `<a onclick="$('#user-games-refresh').attr('date', '${cs}');Change();" style="cursor:pointer;"><rect class="day" title="${play.total}판, ${cs}" width="16" height="16" rx="3" x=${lx} y=${ly} style="stroke: ${stroke}; fill: ${color}" data-count-total=${play.total} data-count-solo=${play.solo} data-count-flex=${play.flex}  data-count-norm=${play.norm}  data-count-aram=${play.aram}  data-count-urf=${play.urf}  data-count-ai=${play.ai}
        data-date=${cs}></rect></a>`


        // Month tag
        if(ctime.getDate() === 15) [
            monhtml += `<text x=${tx + lx - 5} y="-7" class="month">${ctime.getMonth() + 1}월</text>`
        ]

        if(i == 365) {
            html += `</g>`;
        }else if(day == 6) {
            lx--;
            tx += 20;
            html += `</g><g transform="translate(${tx}, 0)">`
        }


        ctime = new Date(ctime - (-24) * 3600 * 1000);

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
