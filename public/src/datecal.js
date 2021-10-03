/** Update Log & Make pDate for graph*/
var pDate = [];
$('.user-games-game').each((i, elem) => {
    var timestamp = $(elem).attr('timestamp') * 1000;
    var fakeTime = new Date(timestamp - offset);
    var timeString = fakeTime.toISOString().slice(0, 10);
    var queueType = $(elem).attr('gametype');
    var queueTypeText = $(elem).find('span.user-games-type').text();

    $(elem).attr('date', timeString);
    $(elem).addClass('log-' + timeString);

    // date text
    var ago = (new Date() - timestamp) / 1000;
    if(ago < 3600) {
        $(elem).find('span.user-games-date').text(Math.ceil((ago/60)) + LANG['min_ago']);
    } else if (ago < 86400) {
        $(elem).find('span.user-games-date').text(Math.ceil((ago/3600)) + LANG['hour_ago']);
    } else if (ago < 604800) {
        $(elem).find('span.user-games-date').text(Math.ceil((ago/86400)) + LANG['days_ago']);
    } else {
        $(elem).find('span.user-games-date').text(timeString.slice(5));
    }

    /** Update pDate */
    if(!pDate[timeString]) {
        pDate[timeString] = {
            "data-count-total": 0,
            "data-count-solo" : 0, // 솔랭
            "data-count-flex" : 0, // 자랭
            "data-count-norm" : 0, // 일반
            "data-count-aram" : 0, // 칼바람
            "data-count-urf"  : 0, // 우루프
            "data-count-ai"   : 0, // 봇전
            "data-count-ofa"  : 0, // 
            "data-count-nbg"  : 0,
            "data-count-usb"  : 0, // Ultimate Spellbook
            "data-count-tut"  : 0,
            "data-count-clash"  : 0,
            "data-count-poro"  : 0,
            "data-count-etc"  : 0
        }
    }
    pDate[timeString]["data-count-total"]++;
    pDate[timeString]["data-count-"+ queueType]++;
});

/** Update Graph data */
for(date in pDate) {
    $('rect#rect-' + date).attr(pDate[date]);
}

/** Udpate period */
var endStr = $('span#username-period-end').text();
var beginStr = $('span#username-period-begin').text();
var end;
var begin;
if(endStr === '???') {
    end = (new Date(new Date() - 31536000000 - offset))
} else {
    end = (new Date(endStr * 1000));
}
if(beginStr === '???') {
    begin = (new Date(new Date() - offset));
} else {
    begin = (new Date(beginStr * 1000));
}

endStr = end.toISOString().slice(0, 10);
beginStr = begin.toISOString().slice(0, 10);

/** Remove out of date rect, remove count*/
// -1
var timeStr = new Date(end - 86400000).toISOString().slice(0, 10);
// $('rect#rect-' + timeStr).css('display', 'none');
// $('rect#rect-' + timeStr).attr({
//     "data-count-total": 0,
//     "data-count-solo" : 0, // 솔랭
//     "data-count-flex" : 0, // 자랭
//     "data-count-norm" : 0, // 일반
//     "data-count-aram" : 0, // 칼바람
//     "data-count-urf"  : 0, // 우루프
//     "data-count-ai"   : 0, // 봇전
//     "data-count-ofa"  : 0, // 
//     "data-count-nbg"  : 0,
//     "data-count-tut"  : 0,
//     "data-count-clash"  : 0,
//     "data-count-poro"  : 0,
//     "data-count-etc"  : 0
// });
$('a.log-' + timeStr).attr('gameType', 'outofdate');

// +1
var timeStr = new Date(begin - (-86400000)).toISOString().slice(0, 10);
// $('rect#rect-' + timeStr).css('display', 'none');
// $('rect#rect-' + timeStr).attr({
//     "data-count-total": 0,
//     "data-count-solo" : 0, // 솔랭
//     "data-count-flex" : 0, // 자랭
//     "data-count-norm" : 0, // 일반
//     "data-count-aram" : 0, // 칼바람
//     "data-count-urf"  : 0, // 우루프
//     "data-count-ai"   : 0, // 봇전
//     "data-count-ofa"  : 0, // 
//     "data-count-nbg"  : 0,
//     "data-count-tut"  : 0,
//     "data-count-clash"  : 0,
//     "data-count-poro"  : 0,
//     "data-count-etc"  : 0
// });
$('a.log-' + timeStr).attr('gameType', 'outofdate');

$('#username-period-end').text(endStr);
$('#username-period-begin').text(beginStr);

/** Period Selector Setting */
$('#period-selector-begin').attr('value', beginStr);
$('#period-selector-end').attr('value', endStr);
$('#period-selector-begin').attr('max', (new Date(new Date() - offset)).toISOString().slice(0, 10));
$('#period-selector-end').attr('max', (new Date(new Date() - offset)).toISOString().slice(0, 10));