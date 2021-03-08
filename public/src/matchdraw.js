async function GetMatch(_matchId, _platform) {
    await fetch(`/${_platform}/match/${_matchId}`)
        .then(response => response.json())
        .then(data => {
            var matchHtml = `<div class="match">`
            for (team in data) {
                var teamHtml = `
                <div class="team">
                    <header class="team-header">
                        <div class="col-champ cell">승리(파랑팀)</div>
                        <div class="col-name cell">${data[team].kills}/${data[team].deaths}/${data[team].assists}</div>
                        <div class="col-item cell">${data[team].gold}</div>
                        <div class="col-kda cell">K/D/A</div>
                        <div class="col-cs cell">cs</div>
                        <div class="col-gold cell">gold</div>
                        <div class="col-damage cell">damage</div>
                    </header>
                    <ul class="team-container">`;
                for (elem of data[team].participants) {
                    var partHtml = `<li class="team-part">
<div class="part-champ cell">
    <div class="part-icon">
        <img src="${RIOTCDNURI}/img/champion/${CHAMPION[elem.champ]}.png" alt="${CHAMPION[elem.champ]}" title="${CHAMPION[elem.championId]}" />
        <span>${elem.stats.champLevel}</span>
    </div>
    <div class="part-spell">
        <img src="${RIOTCDNURI}/img/spell/${SPELL[elem.spell1Id]}.png" />
        <img src="${RIOTCDNURI}/img/spell/${SPELL[elem.spell2Id]}.png" />
    </div>
    <div class="part-rune">
        <img src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune0]}" />
        <img src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.stats.rune1]}" />
    </div>
</div>
<div class="part-name cell">
    <span>${elem.name}</span>
</div>
<div class="part-item cell">
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item0}.png" />
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item1}.png" />
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item2}.png" />
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item3}.png" />
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item4}.png" />
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item5}.png" />
    <img src="${RIOTCDNURI}/img/item/${elem.stats.item6}.png" />
</div>
<div class="part-kda cell">
    <span>${elem.stats.kills}/${elem.stats.deaths}/${elem.stats.assists} (${Math.ceil((elem.stats.kills + elem.stats.assists) / data[team].kills * 100)}%)</span>
</div>
<div class="part-cs cell">
    <span title="${elem.stats.minions} + ${elem.stats.jungle}">${elem.stats.minions + elem.stats.jungle}</span>
</div>
<div class="part-gold cell">
    <span>${elem.stats.gold}</span>
</div>
<div class="part-damage cell">
    <span title="${elem.stats.deal}/${elem.stats.dealTotal}">${elem.stats.deal}</span>
</div>
</li>`;
                    teamHtml += partHtml;
                }
                teamHtml += '</ul></div>'

                matchHtml += teamHtml;
            }

            matchHtml += '</div>';
            $("#match-inspecter").html(matchHtml);
        });
}

$(document).ready(function() {
    var current;
    $('.user-games-game').each(function() {
        $(this).find('.user-games-mini').click(async () => {
            if(this === current) {
                $('#match-inspecter').html('');
                $(current).css('height', $(this).find('.user-games-mini').height())
            }else {
                await GetMatch($(this).attr('matchId'), $(this).attr('platform'))
                $(current).css('height', $(this).find('.user-games-mini').height())
                $(this).css('height', $(this).find('.user-games-mini').height() + $('#match-inspecter').height())
                current = this;
                $('#match-inspecter').css('top', $(this).position().top + $(this).find('.user-games-mini').height());
            
            }

        })
    })
})