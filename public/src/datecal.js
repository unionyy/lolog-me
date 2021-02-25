var offset = new Date().getTimezoneOffset() * 60000;

/** Update Log & Make pDate for graph*/
var pDate = [];
$('a.user-games-game').each((i, elem) => {
    var timestamp = $(elem).attr('timestamp') * 1000;
    var fakeTime = new Date(timestamp - offset);
    var timeString = fakeTime.toISOString().slice(0, 10);
    var queueType = $(elem).attr('gametype');
    var queueTypeText = $(elem).find('span.user-games-type').text();

    $(elem).attr('date', timeString);
    $(elem).addClass('log-' + timeString);
    $(elem).find('span.user-games-date').text(timeString.slice(5));
    $(elem).attr('title', `${timeString}, ${queueTypeText}`);

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

/** Remove future rect */
// -366
var fakeTime = new Date(new Date() - 31622400000 - offset);
var timeString = fakeTime.toISOString().slice(0, 10);
$('rect#rect-' + timeString).css('display', 'none');
$('a.log-' + timeString).attr('gameType', 'outofdate');

// +1
fakeTime = new Date(new Date() - (- 86400000) - offset);
timeString = fakeTime.toISOString().slice(0, 10);
$('rect#rect-' + timeString).css('display', 'none');


/** Udpate period */
var endStr = $('span#username-period-end').text();
var beginStr = $('span#username-period-begin').text();
var end;
var begin;
if(endStr === '???') {
    end = (new Date(new Date() - 31536000000 - offset)).toISOString().slice(0, 10);
} else {
    end = (new Date(endStr * 1000)).toISOString().slice(0, 10);
}
if(beginStr === '???') {
    begin = (new Date(new Date() - offset)).toISOString().slice(0, 10);
} else {
    begin = (new Date(beginStr * 1000)).toISOString().slice(0, 10);
}

$('#username-period-end').text(end);
$('#username-period-begin').text(begin);

/** Period Selector Setting */
$('#period-selector-begin').attr('value', begin);
$('#period-selector-end').attr('value', end);
$('#period-selector-begin').attr('max', (new Date(new Date() - offset)).toISOString().slice(0, 10));
$('#period-selector-end').attr('max', (new Date(new Date() - offset)).toISOString().slice(0, 10));