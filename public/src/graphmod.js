const TYPES = ['solo', 'flex', 'norm', 'aram', 'urf', 'ai'];

Change = function () {
    // Get date
    var date = $('#user-games-refresh').attr('date');
    // Get types
    var types = [];
    const $typecheck = $('#type-check');
    for(var elem of TYPES) {
        if($typecheck.find('#'+elem).prop('checked')) {
            types.push(elem);
            $(`a.user-games-game[gametype='${elem}']`).css('display', 'inline-block');
            if(date !== 'all') {
               $(`a.user-games-game[gametype='${elem}'][date!='${date}']`).css('display', 'none');
            }
        } else {
            $(`a.user-games-game[gametype='${elem}']`).css('display', 'none');
        }
    }
    var totalplay = 0;
    var dateplay = 0;
    var start = 0;
    var end = 0;
    $('rect.day').each(function (i, elem) {
        var play = 0;
        for(type of types) {
            var attrname = 'data-count-' + type;
            play += Number($(elem).attr(attrname));
        }
        var cdate = $(elem).attr('data-date');
        if(cdate === date) {
            dateplay = play;
        }
        totalplay += play;
        if(play !== 0) {
            if(start === 0) {
                start = cdate;
            }
            end = cdate;
        }
        var color;
        var stroke;
        // Set Color
        switch (play) {
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

        $(elem).css({ 'stroke': stroke, 'fill': color });
        $(elem).tooltipster('content', `${play}판, ${cdate}`);
        
    });
    $('#username-total').text(`${totalplay}판 `);
    $('#username-period').text(`(${start}~${end})`);

    if(date === 'all') {
        $('#user-games-number').text(` ${totalplay}판`);
        $('#user-games-period').text(` (${start}~${end})`);
        $('#user-games-refresh').css('display', 'none');
    } else {
        $('#user-games-refresh').css('display', 'inline');
        $('#user-games-number').text(`${dateplay}판`);
        $('#user-games-period').text(` (${date})`);
    }
}