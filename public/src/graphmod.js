const TYPES = ['solo', 'flex', 'norm', 'aram', 'urf', 'ai'];
const ETC = ['ofa', 'nbg', 'tut', 'clash', 'poro', 'etc'];

var typesG;
var dateG;
var positionG;
var championG;

var gameCount;

var chartOptions = {
    pieHole: 0.45,
    chartArea: {
      width: 400,
      height: 180
    },
    width: 400,
    height: 200,
    pieSliceText: 'value',
    legend: 'labeled',
    sliceVisibilityThreshold: 0.01,
    backgroundColor: 'whitesmoke',
    colors:['#38b259','#9be9a8'],
    tooltip: {
        ignoreBounds: true,
        isHtml: true
    }
};

if(matchMedia("only screen and (max-width: 550px)").matches) {
    chartOptions.chartArea = {
        width: 200,
        height: 120
    };
    chartOptions.width = 200;
    chartOptions.height = 140;
    chartOptions.tooltip.trigger = 'none';

    $('html').animate({scrollTop : 133});
}

UpdateLog = function (_types, _date, _position, _champion) {
    /** Hide match detail box */
    RefreshMatch();
    
    /** Set / Get Global Variable */
    if(_types === 'NOT') _types = typesG;
    else typesG = _types;
    if(_date === 'NOT') _date = dateG;
    else dateG = _date;
    if(_position === 'NOT') _position = positionG;
    else positionG = _position;
    if(_champion === 'NOT') _champion = championG;
    else championG = _champion;

    /** Clear Logs */
    $(`.user-games-game`).css('display', 'none');
    $('.user-games-game').removeClass('cur-game');

    var queryStr ='';
    if(_position !== 'ALL') {
        queryStr += `[lane='${_position}']`;
    }
    if(_champion !== 'ALL') {
        queryStr += `[champid='${_champion}']`;
    }

    /** Display Logs */
    var count = 0;
    if(_date === 'all') {
        for (var elem of _types) {
            count += $(`.user-games-game[gametype='${elem}']${queryStr}`).length;
            //$(`.user-games-game[gametype='${elem}']${queryStr}`).css('display', 'inline-block');
            $(`.user-games-game[gametype='${elem}']${queryStr}`).addClass('cur-game');
        }
    } else {
        for (var elem of _types) {
            count += $(`.log-${_date}[gametype='${elem}']${queryStr}`).length;
            //$(`.log-${_date}[gametype='${elem}']${queryStr}`).css('display', 'inline-block');
            $(`.log-${_date}[gametype='${elem}']${queryStr}`).addClass('cur-game');
        }
    }

    /** Page Controller */
    var MAXLOG = 60;
    if(matchMedia("only screen and (max-width: 550px)").matches) {
        MAXLOG = 30;
    }
    const LogSize = $('.user-games-game.cur-game').length;
    const LogPages = Math.ceil(LogSize/MAXLOG);
    var curPage = 1;
    
    $('#controller-left').click(() => {
        if(curPage > 1) {
            curPage--;
            ShowPage(curPage + 1);
        }
    });
    $('#controller-right').click(() => {
        if(curPage < LogPages) {
            curPage++;
            ShowPage(curPage - 1);
        }
    });

    function ShowPage(_prev) {
        RefreshMatch();
        $('#controller-text').text(` ${curPage} / ${LogPages} `);
        
        $('.cur-game').slice(MAXLOG * (_prev - 1), MAXLOG * _prev).css('display', 'none');
        $('.cur-game').slice(MAXLOG * (curPage - 1), MAXLOG * curPage).css('display', 'inline-block');

        $('.controller-button').removeClass('button-active');
        if(curPage > 1) {
            $('#controller-left').addClass('button-active');
        }
        if(curPage < LogPages) {
            $('#controller-right').addClass('button-active');
        }
    }
    ShowPage();

    /** Print Count */
    $('#user-games-number').text(` ${count}${gameCount}`);
    if (_date === 'all' && _position === 'ALL' && _champion === 'ALL') {
        $('#user-games-refresh').css('display', 'none');
    } else {
        $('#user-games-refresh').css('display', 'inline');
    }

    /** Update Recent Game */
    GetRecentGames();
}

GetTypes = function() {
    var types = [];
    /** Type Check */
    const $typecheck = $('#type-check');
    for(var elem of TYPES) {
        if($typecheck.find('#'+elem).prop('checked')) {
            types.push(elem);
        }
    }

    /** Add etc */
    if($typecheck.find('#etc').prop('checked')) {
        for (var elem of ETC) {
            types.push(elem);
        }
    }

    return types
}

Change = function (_init, __game_count) {
    gameCount = __game_count;
    // Get date
    var date = $('#user-games-refresh').attr('date');
    // Get types
    var types = GetTypes();

    /** Update Logs */
    UpdateLog(types, date, 'ALL', 'ALL');

    /** Update Charts */
    UpdatePositionChart(__game_count);
    UpdateChampChart(__game_count);
    

    var totalplay = 0;
    var dateplay = 0;
    $('rect.day').each(function (i, elem) {
        var play = 0;
        var cdate = $(elem).attr('data-date');

        if ($(elem).attr('data-count-total')) {
            for(type of types) {
                var attrname = 'data-count-' + type;
                play += Number($(elem).attr(attrname));
            }
            
            if(cdate === date) {
                dateplay = play;
            }
            totalplay += play;
        }
        
        var color;
        var stroke = 'none';
        // Set Color
        switch (play) {
            case 0:
                color = '#ebedf0';
                stroke = '#e2e4e7';
                break;
            case 1:
                color = '#9be9a8';
                break;
            case 2:
            case 3:
                color = '#6dd686';
                break;
            case 4:
            case 5:
                color = '#40c463';
                break;
            case 6:
                
            
            case 7:
            case 8:
                color = '#38b259';
                break;
            case 9:
                
            case 10:
            case 11:
                color = '#30a14e';
                break;
            case 12:
            case 13:
            case 14:
                color = '#216e39';
                break;
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
                color = '#e99b9b';
                break;
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
                color = '#c44040';
                break;
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
                color = '#a13030';
                break;
            default:
                color = '#6e2121';
                break;
        }

        $(elem).css({ 'stroke': stroke, 'fill': color });
        if(_init) {
            $(elem).attr('title', `${play}${__game_count}, ${cdate}`);
        } else {
            $(elem).tooltipster('content', `${play}${__game_count}, ${cdate}`);
        }
    });
    $('#username-total').text(`${totalplay}${__game_count} `);

    // if(date === 'all') {
    //     $('#user-games-number').text(` ${totalplay}${__game_count}`);
    //     $('#user-games-period').text($('#username-period').text());
    //     $('#user-games-refresh').css('display', 'none');
    // } else {
    //     $('#user-games-refresh').css('display', 'inline');
    //     $('#user-games-number').text(`${dateplay}${__game_count}`);
    //     $('#user-games-period').text(` (${date})`);
    // }
}

function UpdatePositionChart(__game_count) {
    $('#charts-lane-img').removeAttr('src');
    $('#charts-lane-img').removeAttr('alt');
    var positions = {
        
    };
    for(elem of POSITION) {
        positions[elem] = 0;
    }
    $(`.user-games-game.cur-game`).each((i, elem) => {
        var position = $(elem).attr('lane');
        positions[position]++;
    });

    var positionTable = [['Position', __game_count, 'PositionId']];
    for(elem in positions) {
        positionTable.push([LANG[elem], positions[elem], elem]);
    }
    positionTable = positionTable.sort((a, b) => {
        return b[1] - a[1];
    });
    

    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var data = google.visualization.arrayToDataTable(positionTable);

        var chart = new google.visualization.PieChart(document.getElementById('charts-lane'));
        
        chart.draw(data, chartOptions);

        if(positionTable[1] && positionTable[1][1] !== 0) {
            var imgSrc = `/images/icon/Position_${positionTable[1][2]}.svg`;
            $('#charts-lane-img').attr('src', imgSrc);
            $('#charts-lane-img').attr('alt', positionTable[1][2]);
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);

        function selectHandler(e) {
            var position = 'ALL';
            if (chart.getSelection()[0]) {
                position = data.getValue(chart.getSelection()[0].row, 2);
                var imgSrc = `/images/icon/Position_${position}.svg`;
                $('#charts-lane-img').attr('src', imgSrc);
                $('#charts-lane-img').attr('alt', position);
            } else {
                if (positionTable[1] && positionTable[1][1] !== 0) {
                    var imgSrc = `/images/icon/Position_${positionTable[1][2]}.svg`;
                    $('#charts-lane-img').attr('src', imgSrc);
                    $('#charts-lane-img').attr('alt', positionTable[1][2]);
                }
            }
            UpdateLog('NOT', 'NOT', position, 'ALL');
            UpdateChampChart(__game_count);
        }
    }
}

function UpdateChampChart(__game_count) {
    $('#charts-champ-img').removeAttr('src');
    $('#charts-champ-img').removeAttr('alt');
    var champs = {};
    $(`.user-games-game.cur-game`).each((i, elem) => {
        var id = $(elem).attr('champid');
        if(!champs[id]) {
            champs[id] = {
                count: 1
            };
        } else {
            champs[id].count++;
        }
    });

    var champTable = [['Champion', __game_count, 'id']];
    for(elem in champs) {
        champTable.push([LANG.champ[CHAMPION[elem]], champs[elem].count, elem]);
    }
    champTable = champTable.sort((a, b) => {
        return b[1] - a[1];
    });
    
    

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(champTable);

        var chart = new google.visualization.PieChart(document.getElementById('charts-champ'));

        chart.draw(data, chartOptions);

        if(champTable[1]) {
            var imgSrc = $('#charts-champ-img').attr('srcuri');
            imgSrc += `/img/champion/${CHAMPION[champTable[1][2]]}.png`;
            $('#charts-champ-img').attr('src', imgSrc);
            $('#charts-champ-img').attr('alt', champTable[1][2]);
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);

        function selectHandler(e) {
          var champ = 'ALL';
          if(chart.getSelection()[0]) {
            champ = data.getValue(chart.getSelection()[0].row, 2);
            var imgSrc = $('#charts-champ-img').attr('srcuri');
            imgSrc += `/img/champion/${CHAMPION[champ]}.png`;
            $('#charts-champ-img').attr('src', imgSrc);
            $('#charts-champ-img').attr('alt', CHAMPION[champ]);
          } else {
            if(champTable[1]) {
                var imgSrc = $('#charts-champ-img').attr('srcuri');
                imgSrc += `/img/champion/${CHAMPION[champTable[1][2]]}.png`;
                $('#charts-champ-img').attr('src', imgSrc);
                $('#charts-champ-img').attr('alt', CHAMPION[champTable[1][2]]);
            }
          }
          UpdateLog('NOT', 'NOT', 'NOT', champ);
        }
      }
}