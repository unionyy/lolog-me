const MAXRECENTGAMES = 20;

function GetRecentGames(_index=0) {
    if($('.cur-game').length > 0) {
        var queryStr = '?';
        $('.cur-game').each((i, elem) => {
            if(i < _index || i >= _index + MAXRECENTGAMES) return;
    
            var q = 'm='+$(elem).attr('matchid')+'&';
            queryStr += q;
        });
        queryStr = queryStr.slice(0, -1);
    
        var uri = `/${$('#user-platform').attr('value')}/user/${$('#user-name').attr('value')}/detail${queryStr}`
    
        fetch(uri)
            .then(response => response.json(), err => {$("#user-games-recent").html('<span class="recent-fail">Try Again</span>');})
            .then(data => {

                var gamesHtml = '';
                for(gameId in data) {
                    var elem = data[gameId];

                    var parsedWin = ParseWin(elem.win_my);
                    var gameHtml = `<div class="recent-game recent-game-${parsedWin.winText}">`;
                    var mini = $(`.cur-game[matchid=${gameId}]`);
        
                    var killPart = 0;
                    if(elem.total_kills) killPart = Math.ceil((elem.kills + elem.assists) / elem.total_kills * 100);

                    var score;
                    if(elem.deaths === 0) score = 'Perfect';
                    else score = Math.ceil((elem.kills + elem.assists) * 100 / elem.deaths) / 100;

                    var timestamp = mini.attr('timestamp');
                    var itemHtml = ItemGen([elem.item0, elem.item1, elem.item2, elem.item3, elem.item4, elem.item5, elem.item6], FindCDN(timestamp));

                    /** Header */
                    gameHtml += `
                        <div class="recent-header">
                            <div class="recent-type">${mini.find('.user-games-type').text()}</div>
                            <div class="recent-date">${mini.find('.user-games-date').text()}</div>
                            <div class="recent-win">${LANG[parsedWin.winText]}</div>
                            <div class="recent-duration">${Math.ceil(elem.duration/60)}:${(elem.duration % 60).toString().padStart(2,'0')}</div>
                        </div>
                        <div class="recent-champ">
                            <img src="${mini.find('.user-games-icon').attr('src')}" alt="${mini.find('.user-games-icon').attr('art')}" title="${mini.find('.user-games-icon').attr('title')}" />
                            <span>${elem.champ_level}</span>
                        </div>
                        <div class="recent-runespell">
                            <div class="recent-rune">
                                <img class="rune-main" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.rune0]}" />
                                <img class="rune-sub" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.rune1]}" />
                            </div>
                            <div class="recent-spell">
                                <img class="spell1" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell1]}.png" />
                                <img class="spell2" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell2]}.png" />
                            </div>
                        </div>
                        <div class="recent-kda">
                            <div class="recent-kda-kda">
                                <span class="text-kda">${elem.kills}</span>
                                <span>/</span><span class="text-kda">${elem.deaths}</span>
                                <span>/</span><span class="text-kda">${elem.assists}</span>
                            </div>
                            <div class="recent-score">
                                <span class="text-score">${score}</span>
                                <span class="text-killpart">${killPart}%</span>
                            </div>
                            <div class="recent-medal">
                            </div>
                        </div>
                        <div class="recent-etc">
                            <div class="recent-items">
                                ${itemHtml}
                            </div>
                            <div class="recent-cs">
                                ${elem.minions + elem.jungle}
                            </div>
                            <div class="recent-gold">
                                ${elem.gold}
                            </div>
                        </div>
                        <div class="recent-detail"></div>
                        `
                    
                    gameHtml += '</div>'

                    gamesHtml += gameHtml;
                }

                if(_index === 0) {
                    $("#games-recent-log").html(gamesHtml);
                } else {
                    $("#games-recent-log").add(gamesHtml);
                }
            });
    }
    
}