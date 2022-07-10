/** Get Match from /match & Render */

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

function ItemGen(_items, _cdnuri, _vision) {
    /** Item Images */
    var itemsHtml = '';
    var classStr = 'item';
    for(i in _items) {
        var classStrCur = classStr;
        if(i === '0') {
            classStrCur += ' item-first';
        } else if(i==='6') {
            itemsHtml += '<div class="item-vision">';
        }
        if(_items[i] === 0) {
            itemsHtml += `<rect class="${classStrCur}"></rect>`;
        } else {
            itemsHtml += `<img class="${classStrCur}" src="${_cdnuri}/img/item/${_items[i]}.png" item-id="${_items[i]}"/>`
        }

        if(i==='6') {
            itemsHtml +=  `<span class="vision-score" title="
            <span class='vision-name'>${LANG.vision_score}: <deco>${_vision.score}</deco></span>
            <p class='vision-description'>
                ${LANG.wards_buy}: <deco>${_vision.buy}</deco><br>
                ${LANG.wards_place}: <deco>${_vision.place}</deco><br>
                ${LANG.wards_kill}: <deco>${_vision.kill}</deco></p>
            ">${_vision.score}</span></div>`;
        }
    }
    return itemsHtml;
}

function FindCDN(_timestamp, _base) {
    return _base + 'latest';

    _timestamp = new Date(_timestamp);
    /** Find version */
    var cdnuri = _base;
    for(version in VERSION) {
        if(version === 'latest') continue;

        if(VERSION[version] < _timestamp) {
            cdnuri += version;
            break;
        }
    }

    return cdnuri
}

async function GetMatch(_container, _info) {
    await fetch(`/${_info.platform}/match/${_info.matchId}`)
        .then(response => response.json(), err => {_container.html('<span class="match-fail">Try Again</span>');})
        .then(matchData => {
            /** Find version */
            const cdnuri = FindCDN(_info.timestamp, BANANACDN);
            
            /** Seperate Team */
            let myTeam;
            const teams = {};
            for(participant of matchData.participants) {
                const winMy = participant.win_my
                if(teams[winMy]) {
                    teams[winMy].participants.push(participant);
                    teams[winMy].kills += participant.kills;
                    teams[winMy].deaths += participant.deaths;
                    teams[winMy].assists += participant.assists;
                    teams[winMy].gold_earned += participant.gold_earned;
                }
                else teams[winMy] = {
                    participants: [participant],
                    kills: participant.kills,
                    deaths: participant.deaths,
                    assists: participant.assists,
                    gold_earned: participant.gold_earned
                };
            }

            for (teamId in teams) {
                const team = teams[teamId];
                const parsedWin = ParseWin(teamId);
                /** Win or Lose */
                const winText = parsedWin.winText;
                /** Team define */
                const teamText = parsedWin.teamText;

                team.win = winText;

                let teamHtml = `
                <div class="team ${winText}">
                    <header class="team-header">
                        <div class="col-champ cell">
                            <div class="inner-cell-header header-team">
                                <span class="text-team text-${teamText} text-color-${winText}">${LANG[teamText]}</span>
                            </div>
                        </div>
                        <div class="for-mobile col-dummy"></div>
                        <div class="col-name cell">
                            <div class="inner-cell-header">
                                <span class="text-kda-header text-color-${winText}">${team.kills}</span><span class="text-color-${winText}">/</span>
                                <span class="text-kda-header text-color-${winText}">${team.deaths}</span><span class="text-color-${winText}">/</span>
                                <span class="text-kda-header text-color-${winText}">${team.assists}</span>
                                <img class="icon-header ${winText}" src="/images/icon/mask-icon-offense.png" />
                            </div>
                        </div>
                        <div class="col-item cell">
                            <div class="inner-cell-header">
                                <span class="text-gold-header">${team.gold_earned.toLocaleString('ko-KR')}</span>
                                <img class="icon-header" src="/images/icon/mask-icon-gold.png" />
                            </div>
                        </div>
                        <div class="col-kda cell">
                            <div class="inner-cell-header padding-cell">
                            <span><img class="icon-header" src="/images/icon/mask-icon-offense.png" /></span>
                            </div>
                        </div>
                        <div class="col-cs cell"><div class="inner-cell-header padding-cell">
                            <span><img class="icon-header" src="/images/icon/mask-icon-cs.png" /></span>
                        </div></div>
                        <div class="col-gold cell"><div class="inner-cell-header">
                        <span><img class="icon-header" src="/images/icon/mask-icon-gold.png" /></span>
                        </div></div>
                        <div class="col-damage cell part-hide"><div class="inner-cell-header">${LANG['dmg_to_champ']}</div></div>
                    </header>
                    <ul class="team-container">`;
                for (const stat of team.participants) {
                    /** Current User */
                    let isMe = '';
                    if(stat.id_my === user_idMy) {
                        myTeam = stat.win_my;
                        isMe = ' is-me';
                    }

                    /** Rune Images */
                    let runeHtml = '';
                    if(stat.rune_main_id === 0) {
                        runeHtml += `<rect class="rune-main"></rect><rect class="rune-sub"></rect>`;
                    } else {
                        runeHtml += `<img class="rune-main rune" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[stat.rune_main_id]}" rune-id="${stat.rune_main_id}" />
                        <img class="rune-sub rune" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[stat.rune_sub_style]}" rune-id="${stat.rune_sub_style}" />`;

                    }

                    /** Item Images */
                    let visionData = {
                        score: stat.vision_score,
                        buy: stat.wards_bought,
                        place: stat.wards_placed,
                        kill: stat.wards_killed
                    };
                    let itemsHtml = ItemGen([stat.item0, stat.item1, stat.item2, stat.item3, stat.item4, stat.item5, stat.item6], cdnuri, visionData);

                    /** Kill Participation */
                    let killPart = 0;
                    if(stat.total_kills) killPart = Math.round((stat.kills + stat.assists) / stat.total_kills * 100);

                    let partHtml = `<li class="team-part${isMe}" data-deal="${stat.damage_champ}">
                        <div class="part-champ cell">
                            <div class="inner-cell">
                                <div class="part-rune">
                                    ${runeHtml}
                                </div>
                                <div class="part-spell">
                                    <img class="spell1 spell" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[stat.spell1_id]}.png" spell-name="${SPELL[stat.spell1_id]}" />
                                    <img class="spell2 spell" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[stat.spell2_id]}.png" spell-name="${SPELL[stat.spell2_id]}" />
                                </div>
                                <div class="part-level">
                                    <span>${stat.champ_level}</span>     
                                </div>
                            </div>
                        </div>
                        <div class="part-name cell">
                            <div class="inner-cell">
                                <div class="part-icon">
                                    <img src="${RIOTCDNURI + VERSION.latest}/img/champion/${CHAMPION[stat.champ_id]}.png" alt="${CHAMPION[stat.champ_id]}" title="${CHAMPION[stat.champ_id]}" />
                                    <div class="shadow"></div>
                                </div>
                                <a class="part-link" href="/id/${stat.id_my}">${stat.summoner_name}</a>
                            </div>
                        </div>
                        <div class="part-item cell">
                            <div class="inner-cell">
                                ${itemsHtml}
                            </div>
                        </div>
                        <div class="part-kda cell">
                            <div class="inner-cell padding-cell" title="(${killPart}%)">
                                <span class="text-kda">${stat.kills}</span>
                                <span>/</span><span class="text-kda">${stat.deaths}</span>
                                <span>/</span><span class="text-kda">${stat.assists}</span>
                            </div>
                        </div>
                        <div class="part-cs cell">
                            <div class="inner-cell padding-cell">
                                <span class="text-cs" title="${stat.minion_killed} + ${stat.jungle_killed} (${((stat.minion_killed + stat.jungle_killed)/(matchData.duration/60)).toFixed(1)})">${stat.minion_killed + stat.jungle_killed}</span>
                            </div>
                        </div>
                        <div class="part-gold cell">
                            <div class="inner-cell padding-cell">
                                <span class="text-gold">${stat.gold_earned.toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                        <div class="part-damage part-hide cell">
                            <div class="inner-cell">
                                <div class="damage-box ${winText}" data-dmg="${stat.damage_champ}"></div>
                                <span class="text-damage" title="${stat.damage_champ.toLocaleString('ko-KR')}/${stat.damage_total.toLocaleString('ko-KR')}">${stat.damage_champ.toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                        </li>`;
                    teamHtml += partHtml;
                }
                teamHtml += '</ul></div>';

                team.html = teamHtml;
            }

            /** Header */
            let headerHtml = `<div class="match-header">
                    <div class="match-header-left">
                        <div class="match-header-win">
                            <i class="fa fa-circle win-rect ${teams[myTeam].win}" aria-hidden="true"></i>
                            <span>${LANG[teams[myTeam].win]}</span>
                        </div>
                        <div class="match-header-duration">
                            <span>${Math.floor(matchData.duration/60)}:${(matchData.duration % 60).toString().padStart(2,'0')}</span>
                        </div>
                    </div>
                    <div class="match-header-graph">
                        <div class="header-button">
                            <span class="header-graph-text">${LANG['graph']}</span>
                            <span class="header-stats-text part-hide">${LANG['stats']}</span>
                        </div>
                    </div>
                </div>`;

            let matchHtml = `<div class="match ${teams[myTeam].win}">` + headerHtml;

            /** Input & Order teams (My Team First) */
            if(teams[myTeam]) {
                matchHtml += teams[myTeam].html;
            }

            for(teamId in teams) {
                if (teamId != myTeam) {
                    matchHtml += teams[teamId].html;
                }
            }

            matchHtml += '</div>';
            _container.html(matchHtml);
            
            /** Graph Button */
            maxDmg = 0;
            _container.find('.damage-box').each((i, elem) => {
                if(Number($(elem).attr('data-dmg')) > maxDmg) {
                    maxDmg = Number($(elem).attr('data-dmg'));
                }
            });

            _container.find('.match-header-graph').click(async() => {
                if(_container.find('.part-damage').hasClass('part-hide')) {
                    _container.find('.part-damage').removeClass('part-hide');
                    _container.find('.part-item').addClass('part-hide');
                    _container.find('.part-kda').addClass('part-hide');
                    _container.find('.part-cs').addClass('part-hide');
                    _container.find('.part-gold').addClass('part-hide');

                    _container.find('.col-damage').removeClass('part-hide');
                    _container.find('.col-item').addClass('part-hide');
                    _container.find('.col-kda').addClass('part-hide');
                    _container.find('.col-cs').addClass('part-hide');
                    _container.find('.col-gold').addClass('part-hide');

                    _container.find('.header-stats-text').removeClass('part-hide');
                    _container.find('.header-graph-text').addClass('part-hide');

                    let barWdt = 400;
                    /** Mobile */
                    if(matchMedia("only screen and (max-width: 550px)").matches) {
                        _container.find('.part-champ').addClass('mobile-hide');
                        _container.find('.part-link').addClass('mobile-hide');

                        _container.find('.part-name .inner-cell').css('float', 'right');
                        _container.find('.part-icon').css('margin-right', '10px');
                        _container.find('.header-team').css('width', '70');

                        _container.find('.col-dummy').addClass('mobile-hide');
                        _container.find('.col-name').addClass('mobile-hide');

                        barWdt = 200;
                    }

                    _container.find('.damage-box').each((i, elem) => {
                        $(elem).css('width', `${barWdt * $(elem).attr('data-dmg') / maxDmg}`);
                    });
                    
                } else {
                    _container.find('.part-damage').addClass('part-hide');
                    _container.find('.part-item').removeClass('part-hide');
                    _container.find('.part-kda').removeClass('part-hide');
                    _container.find('.part-cs').removeClass('part-hide');
                    _container.find('.part-gold').removeClass('part-hide');

                    _container.find('.col-damage').addClass('part-hide');
                    _container.find('.col-item').removeClass('part-hide');
                    _container.find('.col-kda').removeClass('part-hide');
                    _container.find('.col-cs').removeClass('part-hide');
                    _container.find('.col-gold').removeClass('part-hide');

                    _container.find('.header-graph-text').removeClass('part-hide');
                    _container.find('.header-stats-text').addClass('part-hide');

                    /** Mobile */
                    if(matchMedia("only screen and (max-width: 550px)").matches) {
                        _container.find('.part-champ').removeClass('mobile-hide');
                        _container.find('.part-link').removeClass('mobile-hide');
                    
                        _container.find('.col-dummy').removeClass('mobile-hide');
                        _container.find('.col-name').removeClass('mobile-hide');
                    }
                    _container.find('.part-name .inner-cell').css('float', 'left');
                    _container.find('.header-team').css('width', '');
                }
                
            });

            SetTooltips();
        });
}

const currentMatch = [];
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
                GetMatch($("#match-inspecter"), {
                    platform:   $(cur).attr('platform'),
                    matchId:    $(cur).attr('matchId'),
                    timestamp:  $(cur).attr('timestamp'),
                    miniLog:    $(cur).find('.user-games-mini')
                });
            } else {
                $('#match-inspecter').addClass('match-hide');
            }
        });
    });    
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