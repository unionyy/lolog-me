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

    html += '<div id="match-inspecter"></div>';

    $('#user-games-body').html(html);
    $('#user-games-body').scroll(function() {
        alert('scroll');
    })
}