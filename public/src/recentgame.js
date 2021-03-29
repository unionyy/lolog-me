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
                for(elem of data.data) {
                    var parsedWin = ParseWin(elem.win_my);
                    var mini = $(`.cur-game[matchid=${elem.game_id}]`);
                    var gameHtml = `<div class="recent-game-wrapper" platform="${mini.attr('platform')}" matchId="${mini.attr('matchId')}" timestamp="${mini.attr('timestamp')}">
                        <div class="recent-game recent-game-${parsedWin.winText}">`;
        
                    var killPart = 0;
                    if(elem.total_kills) killPart = Math.ceil((elem.kills + elem.assists) / elem.total_kills * 100);

                    var score;
                    if(elem.deaths === 0) score = 'Perfect';
                    else score = (Math.ceil((elem.kills + elem.assists) * 100 / elem.deaths) / 100).toFixed(2);

                    var minCS = (Math.ceil((elem.minions + elem.jungle) * 600 / elem.duration) / 10).toFixed(1);

                    var timestamp = mini.attr('timestamp');
                    var itemHtml = ItemGen([elem.item0, elem.item1, elem.item2, elem.item3, elem.item4, elem.item5, elem.item6], FindCDN(timestamp));

                    /** Medal */
                    var medalHtml = '';
                    
                    if(elem.multi_kill > 1 && elem.multi_kill < 7) {
                        medalHtml += `<div class="medal"><span class="text-medal">${LANG['multi_kill_' + elem.multi_kill]}</span></div>`;
                    } else if(elem.multi_kill >= 7) {
                        medalHtml += `<div class="medal"><span class="text-medal">${elem.multi_kill + LANG['multi_kill_over']}</span></div>`;
                    }

                    /** Header */
                    gameHtml += `
                        <div class="recent-header recent-cell">
                            <div class="recent-win ${parsedWin.winText}">
                                <div class="recent-rect ${parsedWin.winText}"></div>
                                <span class="recent-win-text">${LANG[parsedWin.winText]}</span>
                            </div>
                            <div class="recent-mini">
                                <div class="recent-type"><span>${mini.find('.user-games-type').text()}</span></div>
                                <div class="recent-date"><span>${mini.find('.user-games-date').text()}</span></div>
                            </div>
                        </div>
                        <div class="recent-champ recent-cell">
                            <img class="recent-champ-icon" src="${mini.find('.user-games-icon').attr('src')}" alt="${mini.find('.user-games-icon').attr('art')}" title="${mini.find('.user-games-icon').attr('title')}" />
                            <div class="shadow recent-shadow ${parsedWin.winText}"></div>
                            <div class="recent-champ-level">
                                <span class="text-level">${elem.champ_level}</span>
                            </div>
                        </div>
                        <div class="recent-runespell recent-cell">
                            <div class="recent-rune">
                                <img class="rune-main" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.rune0]}" />
                                <img class="rune-sub" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.rune1]}" />
                            </div>
                            <div class="recent-spell">
                                <img class="recent-spell-img recent-spell-first" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell1]}.png" />
                                <img class="recent-spell-img" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell2]}.png" />
                            </div>
                        </div>
                        <div class="recent-kda recent-cell">
                            <div class="recent-kda-kda">
                                <span class="text-kda">${elem.kills}</span>
                                <span>/</span><span class="text-kda">${elem.deaths}</span>
                                <span>/</span><span class="text-kda">${elem.assists}</span>
                                <img class="icon-inline" src="/images/icon/mask-icon-offense.png" />
                            </div>
                            <div class="recent-score">
                                <span class="text-score-lang">${LANG['score']}</span>
                                <span class="text-score">${score}</span> 
                            </div>
                            <div class="recent-part">
                                <span class="text-part-lang">${LANG['part']}</span>
                                <span class="text-killpart">${killPart}%</span>
                            </div>
                            <div class="recent-medal">
                                ${medalHtml}
                            </div>
                        </div>
                        
                        <div class="recent-etc recent-cell">
                            <div class="recent-items">
                                ${itemHtml}
                            </div>
                            <div class="recent-cs">
                                <span>${elem.minions + elem.jungle} (${minCS})</span>
                                <img class="icon-inline" src="/images/icon/mask-icon-cs.png" />
                            </div>
                            <div class="recent-gold">
                                <span>${elem.gold.toLocaleString('ko-KR')}</span>
                                <img class="icon-inline" src="/images/icon/mask-icon-gold.png" />
                            </div>
                        </div>
                        <div class="recent-detail ${parsedWin.winText}">
                            <div class="detail-arrow">
                                <i class="detail-up arrow-${parsedWin.winText} fa fa-caret-up" style="display: none;"></i>
                                <i class="detail-down arrow-${parsedWin.winText} fa fa-caret-down"></i>
                            </div>
                        </div>
                        `
                    
                    gameHtml += '</div><div class="recent-match match-hide"></div></div>'

                    gamesHtml += gameHtml;
                }

                if(_index === 0) {
                    $("#games-recent-log").html(gamesHtml);
                } else {
                    $("#games-recent-log").add(gamesHtml);
                }
                /** Recent Detail */
                $('.recent-game-wrapper').each(function () {
                    $(this).find('.recent-detail').click(async () => {
                        if($(this).find('.recent-match').hasClass('match-hide')) {
                            $(this).find('.recent-match').removeClass('match-hide');
                            $(this).find('.detail-up').css('display', 'block');
                            $(this).find('.detail-down').css('display', 'none');
                            await $(this).find('.recent-match').html('<i class="match-loading fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>');
                            GetMatch($(this).find('.recent-match'), {
                                platform: $(this).attr('platform'),
                                matchId: $(this).attr('matchId'),
                                timestamp: $(this).attr('timestamp'),
                                miniLog: $(this).find('.user-games-mini')
                            });
                        } else {
                            $(this).find('.recent-match').addClass('match-hide');
                            $(this).find('.detail-up').css('display', 'none');
                            $(this).find('.detail-down').css('display', 'block');
                        }
                    });
                });

            });
    } else {
        $("#games-recent-log").html('');
    }
}