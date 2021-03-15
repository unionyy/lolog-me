async function GetMatch(_this) {
    await fetch(`/${$(_this).attr('platform')}/match/${$(_this).attr('matchId')}`)
        .then(response => response.json())
        .then(data => {
            var cdnuri = BANANACDN;

            /** Find version */
            var timestamp = $(_this).attr('timestamp');
            for(version in VERSION) {
                if(version === 'latest') continue;

                if(version === '10.19.1') cdnuri = RIOTCDNURI;

                if(VERSION[version] < timestamp) {
                    cdnuri += version;
                    break;
                }
            }
            
            var myTeam;
            for (team in data.teams) {
                /** Win or Lose */
                var winText;
                switch(data.teams[team].win % 10) {
                    case 1:
                        winText = 'Win';
                        break;
                    case 2:
                        winText = 'Lose';
                        break;
                    case 3:
                        winText = 'Remake';
                        break;
                    default:
                        winText = 'Unkown';
                        break;
                }
                /** Team define */
                var teamText;
                if(data.teams[team].win < 10) {
                    teamText = 'Unkown';
                } else if(data.teams[team].win < 20) {
                    teamText = 'Blue';
                } else {
                    teamText = 'Red';
                }

                var teamHtml = `
                <div class="team ${winText}">
                    <header class="team-header">
                        <div class="col-champ cell">
                            <div class="inner-cell-header">
                                <span class="text-WLR text-color-${winText}">${LANG[winText]}</span>
                                <span class="text-team text-${teamText} text-color-${winText}">(${teamText})</span>
                            </div>
                        </div>
                        <div class="col-name cell">
                            <div class="inner-cell-header">
                                <span class="text-kda-header text-color-${winText}">${data.teams[team].kills}</span><span class="text-color-${winText}">/</span>
                                <span class="text-kda-header text-color-${winText}">${data.teams[team].deaths}</span><span class="text-color-${winText}">/</span>
                                <span class="text-kda-header text-color-${winText}">${data.teams[team].assists}</span>
                                <img class="icon-header ${winText}" src="/images/icon/mask-icon-offense.png" />
                            </div>
                        </div>
                        <div class="col-item cell">
                            <div class="inner-cell-header">
                                <span class="text-gold-header">${data.teams[team].gold.toLocaleString('ko-KR')}</span>
                                <img class="icon-header" src="/images/icon/mask-icon-gold.png" />
                            </div>
                        </div>
                        <div class="col-kda cell">
                            <div class="inner-cell-header padding-cell">
                            <img class="icon-header" src="/images/icon/mask-icon-offense.png" />
                            </div>
                        </div>
                        <div class="col-cs cell"><div class="inner-cell-header padding-cell">
                            <img class="icon-header" src="/images/icon/mask-icon-cs.png" />
                        </div></div>
                        <div class="col-gold cell"><div class="inner-cell-header">
                            <img class="icon-header" src="/images/icon/mask-icon-gold.png" />
                        </div></div>
                        <!--
                        <div class="col-damage cell"><div class="inner-cell-header">Damage</div></div>
                        -->
                    </header>
                    <ul class="team-container">`;
                for (elem of data.teams[team].participants) {
                    /** Current User */
                    var isMe = '';
                    if($('#user-profile-name').attr('accountId') === elem.id.accountId) {
                        myTeam = team;
                        isMe = ' is-me';

                        /** Add Class to mini log */
                        var miniLog = $(_this).find('.user-games-mini');
                        $(miniLog).addClass('cur-log')
                        $('#match-inspecter').removeClass('inspecter-win');
                        $('#match-inspecter').removeClass('inspecter-lose');
                        if (winText === 'Win') {
                            $('#match-inspecter').addClass('inspecter-win');
                            $(miniLog).addClass('log-win');
                        } else if (winText === 'Lose') {
                            $('#match-inspecter').addClass('inspecter-lose')
                            $(miniLog).addClass('log-lose');
                        }
                    }

                    /** Item Images */
                    var itemsHtml = '';
                    var classStr = 'item';
                    for(i in elem.stats.items) {
                        var classStrCur = classStr;
                        if(i === '0') {
                            classStrCur += ' item-first';
                        }
                        if(elem.stats.items[i] === 0) {
                            itemsHtml += `<rect class="${classStrCur}"></rect>`;
                        } else {
                            itemsHtml += `<img class="${classStrCur}" src="${cdnuri}/img/item/${elem.stats.items[i]}.png" />`
                        }
                    }
                    /** Kill Participation */
                    var killPart = 0;
                    if(data.teams[team].kills) killPart = Math.ceil((elem.stats.kills + elem.stats.assists) / data.teams[team].kills * 100);

                    var partHtml = `<li class="team-part${isMe}">
                        <div class="part-champ cell">
                            <div class="inner-cell">
                                <div class="part-rune">
                                    <img class="rune-main" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune0]}" />
                                    <img class="rune-sub" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune1]}" />
                                </div>
                                <div class="part-spell">
                                    <img class="spell1" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell1Id]}.png" />
                                    <img class="spell2" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell2Id]}.png" />
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
                                    <div class="shadow"></div>
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
                            <div class="inner-cell padding-cell" title="(${killPart}%)">
                                <span class="text-kda">${elem.stats.kills}</span>
                                <span>/</span><span class="text-kda">${elem.stats.deaths}</span>
                                <span>/</span><span class="text-kda">${elem.stats.assists}</span>
                            </div>
                        </div>
                        <div class="part-cs cell">
                            <div class="inner-cell padding-cell">
                                <span class="text-cs" title="${elem.stats.minions} + ${elem.stats.jungle} (${((elem.stats.minions + elem.stats.jungle)/(data.duration/60)).toFixed(1)})">${elem.stats.minions + elem.stats.jungle}</span>
                            </div>
                        </div>
                        <div class="part-gold cell">
                            <div class="inner-cell padding-cell">
                                <span class="text-gold">${elem.stats.gold.toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                        <!-- <div class="part-damage cell">
                            <div class="inner-cell">
                                <span class="text-damage" title="${elem.stats.deal.toLocaleString('ko-KR')}/${elem.stats.dealTotal.toLocaleString('ko-KR')}">${elem.stats.deal.toLocaleString('ko-KR')}</span>
                            </div>
                        </div>-->
                        </li>`;
                    teamHtml += partHtml;
                }
                teamHtml += '</ul></div>'

                data.teams[team].html = teamHtml;
            }

            var matchHtml = `<div class="match">`
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
            /** Init Class */
            $(currentMatch).find('.user-games-mini').removeClass('cur-log');

            if(this === currentMatch) {
                RefreshMatch();
            }else {
                await GetMatch(this);
                $(currentMatch).css('height', $(this).find('.user-games-mini').height())
                $(this).css('height', $(this).find('.user-games-mini').height() + $('#match-inspecter').height() + 4)
                currentMatch = this;
                $('#match-inspecter').css('top', $(this).position().top + $(this).find('.user-games-mini').height() + 4);
            
            }

        })
    })
})

function RefreshMatch() {
    if(currentMatch) {
        $('#match-inspecter').html('');
        $(currentMatch).css('height', $(currentMatch).find('.user-games-mini').height());
        currentMatch = undefined;
    }
}