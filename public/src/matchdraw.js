async function GetMatch(_matchId, _platform, _timestamp) {
    await fetch(`/${_platform}/match/${_matchId}`)
        .then(response => response.json())
        .then(data => {
            var cdnuri = BANANACDN;
            for(version in VERSION) {
                if(version === 'latest') continue;

                if(version === '10.19.1') cdnuri = RIOTCDNURI;

                if(VERSION[version] < _timestamp) {
                    cdnuri += version;
                    break;
                }
            }
            var matchHtml = `<div class="match">`
            var myTeam;
            for (team in data.teams) {
                var teamHtml = `
                <div class="team">
                    <header class="team-header">
                        <div class="col-champ cell">${data.teams[team].win}(${team})</div>
                        <div class="col-name cell">${data.teams[team].kills}/${data.teams[team].deaths}/${data.teams[team].assists}</div>
                        <div class="col-item cell">${data.teams[team].gold}</div>
                        <div class="col-kda cell">K/D/A</div>
                        <div class="col-cs cell">cs</div>
                        <div class="col-gold cell">gold</div>
                        <div class="col-damage cell">damage</div>
                    </header>
                    <ul class="team-container">`;
                for (elem of data.teams[team].participants) {
                    /** Current User */
                    if($('#user-profile-name').attr('accountId') === elem.id.accountId) {
                        myTeam = team;
                    }

                    /** Item Images */
                    var itemsHtml = '';
                    for(item of elem.stats.items) {
                        if(item === 0) {
                            itemsHtml += '<img />'
                        } else {
                            itemsHtml += `<img src="${cdnuri}/img/item/${item}.png" />`
                        }
                    }
                    /** Kill Participation */
                    var killPart = 0;
                    if(data.teams[team].kills) killPart = Math.ceil((elem.stats.kills + elem.stats.assists) / data.teams[team].kills * 100);

                    var partHtml = `<li class="team-part">
                        <div class="part-champ cell">
                            <div class="inner-cell">
                                <div class="part-rune">
                                    <img class="rune-main" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune0]}" />
                                    <img class="rune-sub" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune1]}" />
                                </div>
                                <div class="part-spell">
                                    <img src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell1Id]}.png" />
                                    <img src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell2Id]}.png" />
                                </div>
                                <div class="part-level">
                                    <span>${elem.stats.champLevel}</span>     
                                </div>
                            </div>
                        </div>
                        <div class="part-name cell">
                            <div class="inner-cell">
                                <div class="part-icon">
                                    <img src="${RIOTCDNURI + VERSION.latest}/img/champion/${CHAMPION[elem.champ]}.png" alt="${CHAMPION[elem.champ]}" title="${CHAMPION[elem.championId]}" />
                                </div>
                                <span>${elem.id.name}</span>
                            </div>
                        </div>
                        <div class="part-item cell">
                            <div class="inner-cell">
                                ${itemsHtml}
                                <div class="vision-score">
                                    <span title="Buy: ${elem.stats.wardsBought}, Place: ${elem.stats.wardsPlaced}, Kill: ${elem.stats.wardsKilled}">${elem.stats.visionScore}</span>
                                </div>
                            </div>
                        </div>
                        <div class="part-kda cell">
                            <div class="inner-cell">
                                <span class="text-kda">${elem.stats.kills}</span>
                                <span>/</span><span class="text-kda">${elem.stats.deaths}</span>
                                <span>/</span><span class="text-kda">${elem.stats.assists}</span>
                                <span class="text-kill-participation">(${killPart}%)</span>
                            </div>
                        </div>
                        <div class="part-cs cell">
                            <div class="inner-cell">
                                <span class="text-cs" title="${elem.stats.minions} + ${elem.stats.jungle}">${elem.stats.minions + elem.stats.jungle}</span>
                                <span class="text-cs-min">(${((elem.stats.minions + elem.stats.jungle)/(data.duration/60)).toFixed(1)})</span>
                            </div>
                        </div>
                        <div class="part-gold cell">
                            <div class="inner-cell">
                                <span class="text-gold">${elem.stats.gold}</span>
                            </div>
                        </div>
                        <div class="part-damage cell">
                            <div class="inner-cell">
                                <span class="text-damage" title="${elem.stats.deal}/${elem.stats.dealTotal}">${elem.stats.deal}</span>
                            </div>
                        </div>
                        </li>`;
                    teamHtml += partHtml;
                }
                teamHtml += '</ul></div>'

                data.teams[team].html = teamHtml;
            }

            /** Input & Order teams */
            if(data.teams[myTeam]) {
                matchHtml += data.teams[myTeam].html;
            }

            for(team in data.teams) {
                if (team !== myTeam) {
                    matchHtml += data.teams[team].html;
                }
            }

            matchHtml += '</div>';
            $("#match-inspecter").html(matchHtml);
        });
}

var currentMatch;
$(document).ready(function() {
    $('.user-games-game').each(function() {
        $(this).find('.user-games-mini').click(async () => {
            if(this === currentMatch) {
                RefreshMatch();
            }else {
                await GetMatch($(this).attr('matchId'), $(this).attr('platform'), $(this).attr('timestamp'))
                $(currentMatch).css('height', $(this).find('.user-games-mini').height())
                $(this).css('height', $(this).find('.user-games-mini').height() + $('#match-inspecter').height())
                currentMatch = this;
                $('#match-inspecter').css('top', $(this).position().top + $(this).find('.user-games-mini').height());
            
            }

        })
    })
})

function RefreshMatch() {
    if(currentMatch) {
        $('#match-inspecter').html('');
        $(currentMatch).css('height', $(currentMatch).find('.user-games-mini').height())
        currentMatch = undefined;
    }
}