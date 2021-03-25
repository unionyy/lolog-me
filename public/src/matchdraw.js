function ParseWin(_winMy) {
    /** Win or Lose */
    var winText;
    switch(_winMy % 10) {
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
    if(_winMy < 10) {
        teamText = 'Unkown';
    } else if(_winMy < 20) {
        teamText = 'BlueTeam';
    } else {
        teamText = 'RedTeam';
    }

    return {winText: winText, teamText: teamText};
}

function ItemGen(_items, _cdnuri) {
    /** Item Images */
    var itemsHtml = '';
    var classStr = 'item';
    for(i in _items) {
        var classStrCur = classStr;
        if(i === '0') {
            classStrCur += ' item-first';
        }
        if(_items[i] === 0) {
            itemsHtml += `<rect class="${classStrCur}"></rect>`;
        } else {
            itemsHtml += `<img class="${classStrCur}" src="${_cdnuri}/img/item/${_items[i]}.png" />`
        }
    }
    return itemsHtml;
}

function FindCDN(_timestamp) {
    /** Find version */
    var cdnuri = BANANACDN;
    for(version in VERSION) {
        if(version === 'latest') continue;

        if(version === '10.19.1') cdnuri = RIOTCDNURI;

        if(VERSION[version] < _timestamp) {
            cdnuri += version;
            break;
        }
    }
    return cdnuri
}

async function GetMatch(_this) {
    await fetch(`/${$(_this).attr('platform')}/match/${$(_this).attr('matchId')}`)
        .then(response => response.json(), err => {$("#match-inspecter").html('<span class="match-fail">Try Again</span>');})
        .then(data => {
            /** Find version */
            var timestamp = $(_this).attr('timestamp');
            var cdnuri = FindCDN(timestamp)
            
            var myTeam;
            for (team in data.teams) {
                var parsedWin = ParseWin(data.teams[team].win);
                /** Win or Lose */
                var winText = parsedWin.winText;
                /** Team define */
                var teamText = parsedWin.teamText

                data.teams[team].win = winText;

                var teamHtml = `
                <div class="team ${winText}">
                    <header class="team-header">
                        <div class="col-champ cell">
                            <div class="inner-cell-header header-team">
                                <span class="text-team text-${teamText} text-color-${winText}">${LANG[teamText]}</span>
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
                        $(miniLog).addClass('log-' + winText);
                    }

                    /** Rune Images */
                    var runeHtml = '';
                    if(elem.stats.rune0 === 0) {
                        runeHtml += `<rect class="rune-main"></rect><rect class="rune-sub"></rect>`;
                    } else {
                        runeHtml += `<img class="rune-main" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune0]}" />
                        <img class="rune-sub" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune1]}" />`;

                    }

                    /** Item Images */
                    var itemsHtml = ItemGen(elem.stats.items, cdnuri);

                    /** Kill Participation */
                    var killPart = 0;
                    if(data.teams[team].kills) killPart = Math.ceil((elem.stats.kills + elem.stats.assists) / data.teams[team].kills * 100);

                    var partHtml = `<li class="team-part${isMe}">
                        <div class="part-champ cell">
                            <div class="inner-cell">
                                <div class="part-rune">
                                    ${runeHtml}
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
                                <a class="part-link" href="/${elem.id.platform.toLowerCase()}/id/${elem.id.accountId}">${elem.id.name}</a>
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
                teamHtml += '</ul></div>';

                data.teams[team].html = teamHtml;
            }

            /** Header */
            var headerHtml = `<div class="match-header">
                    <div class="match-header-win">
                        <i class="fa fa-circle win-rect ${data.teams[myTeam].win}" aria-hidden="true"></i>
                        <span>${LANG[data.teams[myTeam].win]}</span>
                    </div>
                    <div class="match-header-duration">
                        <span>${Math.ceil(data.duration/60)}:${(data.duration % 60).toString().padStart(2,'0')}</span>
                    </div>
                </div>`;

            var matchHtml = `<div class="match ${data.teams[myTeam].win}">` + headerHtml;
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

var currentMatch = [];
$(document).ready(function() {
    $('.user-games-game').each(function() {
        $(this).find('.user-games-mini').click(async () => {
            /** Init Class */
            if(currentMatch[0]) {
                if(currentMatch[0] !== this) {
                    currentMatch.push(this);
                }

                $(currentMatch[0]).find('.user-games-mini').removeClass('cur-log');
                $(currentMatch[0]).css('height', $(this).find('.user-games-mini').height());

                currentMatch.splice(0, 1);
            } else {
                currentMatch.push(this);
            }

            if(currentMatch[0]) {
                var cur = currentMatch[0];
                $('#match-inspecter').removeClass('match-hide');
                $(cur).css('height', $(cur).find('.user-games-mini').height() + $('#match-inspecter').height() + 4);
                $(cur).find('.user-games-mini').addClass('cur-log');
                $('#match-inspecter').css('top', $('#user-games-all').scrollTop() + $(cur).position().top + $(cur).find('.user-games-mini').height() + 4);
                await $('#match-inspecter').html('<i class="match-loading fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>');
                GetMatch(cur);
            } else {
                $('#match-inspecter').addClass('match-hide');
            }
        })
    })
});

function RefreshMatch() {
    $('#match-inspecter').html('');
    $('#match-inspecter').addClass('match-hide');
    for (elem of currentMatch) {
        $(elem).css('height', $(elem).find('.user-games-mini').height());
        $(elem).find('.user-games-mini').removeClass('cur-log');
    }
    currentMatch = [];
}