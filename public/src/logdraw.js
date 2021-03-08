DrawLog = function() {
    const CHAMPIONURI = RIOTCDNURI + '/img/champion/';
    var html = '';

    for(elem of logArray) {
        html +=
            `<div class="user-games-game" platform="${elem.platform}" matchId="${elem.matchId}" timestamp="${elem.timestamp}" gametype="${elem.queue}" champname="${elem.champion}" champid="${elem.champion}" lane="${elem.lane}">
                <a class="user-games-mini">
                    <img class="user-games-icon" src="${CHAMPIONURI + CHAMPION[elem.champion]}.png" alt="${CHAMPION[elem.champion]}">
                    <span class="user-games-date">???</span><br>
                    <span class="user-games-type">${LANG['icon_'+elem.queue]}</span>
                </a>
            </div>
            `;
    }

    $('#user-games-body').html(html);
    
}