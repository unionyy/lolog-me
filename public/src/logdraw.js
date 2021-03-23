DrawLog = function() {
    const CHAMPIONURI = RIOTCDNURI + VERSION.latest + '/img/champion/';
    var html = '';

    for(elem of logArray) {
        const platform = elem[0];
        const matchId = elem[1];
        const timestamp = elem[2];
        const queue = elem[3];
        const champion = elem[4];
        const lane = elem[5];
        html +=
            `<div class="user-games-game" platform="${platform}" matchId="${matchId}" timestamp="${timestamp}" gametype="${queue}" champname="${champion}" champid="${champion}" lane="${lane}">
                <a class="user-games-mini">
                    <img class="user-games-icon" src="${CHAMPIONURI + CHAMPION[champion]}.png" alt="${CHAMPION[champion]}">
                    <span class="user-games-type">${LANG['icon_'+ queue]}</span>
                    <br>
                    <span class="user-games-date">???</span><br>
                </a>
            </div>\n
            `;
    }

    html += '<div id="match-inspecter" class="match-hide"></div>';
    /** mover */
    html += '<div id="user-games-controller" current-page="1"><i class="fa fa-caret-left controller-button" id="controller-left" aria-hidden="true"></i><span id="controller-text"> 1 / 1 </span><i class="fa fa-caret-right controller-button" id="controller-right" aria-hidden="true"></i></div>'

    $('#user-games-all').html(html);

}