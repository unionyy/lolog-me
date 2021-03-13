async function GetMatch(_matchId, _platform, _timestamp) {
    await fetch(`/${_platform}/match/${_matchId}`)
        .then(response => response.json())
        .then(data => {
            var cdnuri = RIOTCDNURI;
            for(version in VERSION) {
                if(version === 'latest') continue;

                if(VERSION[version] < _timestamp) {
                    cdnuri += version;
                    break;
                }
            }
            var matchHtml = `<div class="match">`
            var myTeam;
            for (team in data) {
                var teamHtml = `
                <div class="team">
                    <header class="team-header">
                        <div class="col-champ cell">${data[team].win}(${team})</div>
                        <div class="col-name cell">${data[team].kills}/${data[team].deaths}/${data[team].assists}</div>
                        <div class="col-item cell">${data[team].gold}</div>
                        <div class="col-kda cell">K/D/A</div>
                        <div class="col-cs cell">cs</div>
                        <div class="col-gold cell">gold</div>
                        <div class="col-damage cell">damage</div>
                    </header>
                    <ul class="team-container">`;
                for (elem of data[team].participants) {
                    /** Current User */
                    if($('#user-profile-name').attr('accountId') === elem.id.accountId) {
                        myTeam = team;
                    }

                    var partHtml = `<li class="team-part">
<div class="part-champ cell">
    <div class="inner-cell">
        <div class="part-rune">
            <img class="rune-main" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune0]}" />
            <img class="rune-sub" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune1]}" />
        </div>
        <div class="part-spell">
            <img src="${RIOTCDNURI+VERSION.latest}/img/spell/${SPELL[elem.spell1Id]}.png" />
            <img src="${RIOTCDNURI+VERSION.latest}/img/spell/${SPELL[elem.spell2Id]}.png" />
        </div>
        <div class="part-level">
            <span>${elem.stats.champLevel}</span>     
        </div>
    </div>
</div>
<div class="part-name cell">
    <div class="inner-cell">
        <div class="part-icon">
            <img src="${RIOTCDNURI+VERSION.latest}/img/champion/${CHAMPION[elem.champ]}.png" alt="${CHAMPION[elem.champ]}" title="${CHAMPION[elem.championId]}" />
        </div>
        <span>${elem.id.name}</span>
    </div>
</div>
<div class="part-item cell">
    <div class="inner-cell">
        <img src="${cdnuri}/img/item/${elem.stats.item0}.png" />
        <img src="${cdnuri}/img/item/${elem.stats.item1}.png" />
        <img src="${cdnuri}/img/item/${elem.stats.item2}.png" />
        <img src="${cdnuri}/img/item/${elem.stats.item3}.png" />
        <img src="${cdnuri}/img/item/${elem.stats.item4}.png" />
        <img src="${cdnuri}/img/item/${elem.stats.item5}.png" />
        <img src="${cdnuri}/img/item/${elem.stats.item6}.png" />
    </div>
</div>
<div class="part-kda cell">
    <div class="inner-cell">
        <span>${elem.stats.kills}/${elem.stats.deaths}/${elem.stats.assists} (${Math.ceil((elem.stats.kills + elem.stats.assists) / data[team].kills * 100)}%)</span>
    </div>
</div>
<div class="part-cs cell">
    <div class="inner-cell">
        <span title="${elem.stats.minions} + ${elem.stats.jungle}">${elem.stats.minions + elem.stats.jungle}</span>
    </div>
</div>
<div class="part-gold cell">
    <div class="inner-cell">
        <span>${elem.stats.gold}</span>
    </div>
</div>
<div class="part-damage cell">
    <div class="inner-cell">
        <span title="${elem.stats.deal}/${elem.stats.dealTotal}">${elem.stats.deal}</span>
    </div>
</div>
</li>`;
                    teamHtml += partHtml;
                }
                teamHtml += '</ul></div>'

                data[team].html = teamHtml;
            }

            /** Input & Order teams */
            if(data[myTeam]) {
                matchHtml += data[myTeam].html;
            }

            for(team in data) {
                if (team !== myTeam) {
                    matchHtml += data[team].html;
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