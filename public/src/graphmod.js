const TYPES = ['solo', 'flex', 'norm', 'aram', 'urf', 'ai'];
const ETC = ['ofa', 'nbg', 'tut', 'clash', 'poro', 'etc'];

Change = function (_init, __game_count) {
    // Get date
    var date = $('#user-games-refresh').attr('date');
    // Get types
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

    /** Clear Logs */
    $(`a.user-games-game`).css('display', 'none');

    /** Display Logs */
    if(date === 'all') {
        for (var elem of types) {
            $(`a.user-games-game[gametype='${elem}']`).css('display', 'inline-block');
        }
    } else {
        for (var elem of types) {
            $(`a.log-${date}[gametype='${elem}']`).css('display', 'inline-block');
        }
    }

    /** Update Charts */
    UpdateChart(__game_count);
    

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

function UpdateChart(__game_count) {
    var champs = {};
    var lanes = {
        TOP: 0,
        JUNGLE: 0,
        MIDDLE: 0,
        BOTTOM: 0,
        SUPPORT: 0,
        NONE: 0
    }
    $(`a.user-games-game[style="display: inline-block;"]`).each((i, elem) => {
        var id = $(elem).attr('champid');
        if(!champs[id]) {
            champs[id] = 1;
        } else {
            champs[id]++;
        }

        var lane = $(elem).attr('lane');
        lanes[lane]++;
    });

    var labels = [];
    var values = [];
    for(elem in champs) {
        labels.push(elem);
        values.push(champs[elem]);
    }

    const data = {
        labels: labels,
        datasets: [
            {
                values: values
            }
        ]
    }

    const chart = new frappe.Chart("#charts-champ", {
        title: "Champ",
        data: data,
        type: 'donut',
        height: 300,
        maxSlices: 12,
        tooltipOptions: {
            formatTooltipX: d => d,
            formatTooltipY: d => d + __game_count,
        },
    })

    var labelsLane = [];
    var valuesLane = [];
    for(elem in lanes) {
        labelsLane.push(elem);
        valuesLane.push(lanes[elem]);
    }

    const dataLane = {
        labels: labelsLane,
        datasets: [
            {
                values: valuesLane
            }
        ]
    }

    const chartLane = new frappe.Chart("#charts-lane", {
        title: "Lane",
        data: dataLane,
        type: 'donut',
        height: 300,
        maxSlices: 12,
        tooltipOptions: {
            formatTooltipX: d => d,
            formatTooltipY: d => d + __game_count,
        },
    })
}