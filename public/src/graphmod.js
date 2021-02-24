const TYPES = ['solo', 'flex', 'norm', 'aram', 'urf', 'ai'];
const ETC = ['ofa', 'nbg', 'tut', 'clash', 'poro', 'etc'];

UpdateLog = function (_types, _date, _position, _champion) {
    /** Clear Logs */
    $(`a.user-games-game`).css('display', 'none');

    var queryStr ='';
    if(_position !== 'ALL') {
        queryStr += `[lane='${_position}']`
    }
    if(_champion !== 'ALL') {
        queryStr += `[champid='${_champion}']`
    }

    /** Display Logs */
    if(_date === 'all') {
        for (var elem of _types) {
            $(`a.user-games-game[gametype='${elem}']${queryStr}`).css('display', 'inline-block');
        }
    } else {
        for (var elem of _types) {
            $(`a.log-${_date}[gametype='${elem}']${queryStr}`).css('display', 'inline-block');
        }
    }
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
                stroke = '#e2e4e7'
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

    if(date === 'all') {
        $('#user-games-number').text(` ${totalplay}${__game_count}`);
        $('#user-games-period').text($('#username-period').text());
        $('#user-games-refresh').css('display', 'none');
    } else {
        $('#user-games-refresh').css('display', 'inline');
        $('#user-games-number').text(`${dateplay}${__game_count}`);
        $('#user-games-period').text(` (${date})`);
    }
}

function UpdatePositionChart(__game_count) {
    var positions = {
        TOP: 0,
        JUNGLE: 0,
        MIDDLE: 0,
        BOTTOM: 0,
        SUPPORT: 0,
        UNKNOWN: 0,
        NONE: 0
    }
    $(`a.user-games-game[style="display: inline-block;"]`).each((i, elem) => {
        var position = $(elem).attr('lane');
        positions[position]++;
    });

    var positionTable = [['Position', __game_count]];
    for(elem in positions) {
        positionTable.push([elem, positions[elem]]);
    }

    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var data = google.visualization.arrayToDataTable(positionTable);

        var options = {
            pieHole: 0.41,
            chartArea: {
                width: 180,
                height: 180
            },
            width: 300,
            height: 300,
            pieSliceText: 'label',
            legend: 'none',
            sliceVisibilityThreshold: 0.01,
            backgroundColor: 'whitesmoke'
        };

        var chart = new google.visualization.PieChart(document.getElementById('charts-lane'));
        
        chart.draw(data, options);

        google.visualization.events.addListener(chart, 'select', selectHandler);

        function selectHandler(e) {
          var position = 'ALL';
          if(chart.getSelection()[0]) {
            position = data.getValue(chart.getSelection()[0].row, 0);
          }
          UpdateLog(GetTypes(), $('#user-games-refresh').attr('date'),
            position, 'ALL');
          UpdateChampChart(__game_count);
        }
      }
}

function UpdateChampChart(__game_count) {
    var champs = {};
    $(`a.user-games-game[style="display: inline-block;"]`).each((i, elem) => {
        var id = $(elem).attr('champid');
        if(!champs[id]) {
            champs[id] = 1;
        } else {
            champs[id]++;
        }
    });

    var champTable = [['Champion', __game_count]];
    for(elem in champs) {
        champTable.push([elem, champs[elem]]);
    }
    champTable = champTable.sort((a, b) => {
        return b[1] - a[1];
    })

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(champTable);

        var options = {
            pieHole: 0.41,
            chartArea: {
              width: 180,
              height: 180
            },
            width: 300,
            height: 300,
            pieSliceText: 'label',
            legend: 'none',
          sliceVisibilityThreshold: 0.01,
          backgroundColor: 'whitesmoke'
        };

        var chart = new google.visualization.PieChart(document.getElementById('charts-champ'));

        chart.draw(data, options);

        google.visualization.events.addListener(chart, 'select', selectHandler);

        function selectHandler(e) {
          var champ = 'ALL';
          if(chart.getSelection()[0]) {
            champ = data.getValue(chart.getSelection()[0].row, 0);
          }
          UpdateLog(GetTypes(), $('#user-games-refresh').attr('date'),
            'ALL', champ);
        }
      }
}