DrawLog = function(RIOTCDNURI) {
    const CHAMPIONURI = RIOTCDNURI + '/img/champion/';
    const array = JSON.parse($('#user-games-body').html())['data'];
    var html = '';

    for(elem of array) {
        //var url = `/${Object.keys(PLATFORM_MY)[game.platform_my]}/match/${game.game_id}`;
        var url = `https://matchhistory.kr.leagueoflegends.com/#match-details/${elem[0]}?tab=overview`;
        html +=
            `<a class="user-games-game" href="${url}" target="_blank" rel="noopener noreferrer" timestamp="${elem[1]}" gametype="${elem[2]}" champname="${elem[5]}" champid="${elem[3]}" lane="${elem[4]}">
                <img class="user-games-icon" src="${CHAMPIONURI + elem[3]}.png" alt="${elem[3]}">
                <span class="user-games-date">???</span><br>
                <span class="user-games-type">${LANG['icon_'+elem[2]]}</span>
            </a>
            `;
    }

    $('#user-games-body').html(html);
    
}