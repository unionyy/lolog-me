const MAXRECENTGAMES = 20;

function GetRecentGames() {
    if($('.cur-game').length > 0) {
        var queryStr = '?';
        $('.cur-game').each((i, elem) => {
            if(i >= MAXRECENTGAMES) return;
    
            var q = 'm='+$(elem).attr('matchid')+'&';
            queryStr += q;
        });
        queryStr = queryStr.slice(0, -1);
    
        var uri = `/${$('#user-platform').attr('value')}/user/${$('#user-name').attr('value')}/detail${queryStr}`
    
        fetch(uri)
            .then(response => response.json(), err => {$("#user-games-recent").html('<span class="recent-fail">Try Again</span>');})
            .then(data => {
                $("#user-games-recent").html(data);
            });
    }
    
}