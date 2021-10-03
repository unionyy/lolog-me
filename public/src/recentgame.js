const MAXRECENTGAMES = 20;

var curIndex = 0;

function AddMoreListener() {
    $('.icon-more').removeClass('hide');
    $('.icon-more-wait').addClass('hide');
    $('#recent-more').off();
    $('#recent-more').one('click',function() {
        GetRecentGames(curIndex + MAXRECENTGAMES);
        $('.icon-more').addClass('hide');
        $('.icon-more-wait').removeClass('hide');
    });
}

function GetRecentGames(_index=0) {
    curIndex = _index;
    var isEnd = true;
    if(user_totalMatchList.length > 0) {
        var queryStr = `?idmy=${user_idMy}&`;
        for(let i = _index; i < user_totalMatchList.length; i++) {
            if(i >= _index + MAXRECENTGAMES) {
                isEnd = false;
                break;
            }
            var q = `m=${user_totalMatchList[i]}&`;
            queryStr += q;
        }
        queryStr = queryStr.slice(0, -1);
    
        var uri = `/${user_platform}/matches${queryStr}`;
    
        fetch(uri)
            .then(response => response.json(), err => {$("#user-games-recent").html('<span class="recent-fail">Try Again</span>');})
            .then(matches => {
                let matchesHtml = '';

                let killSum = 0;
                let deathSum = 0;
                let assistSum = 0;
                let killTotalSum = 0;
                for(let i = _index; i < user_totalMatchList.length; i++) {
                    if(i >= _index + MAXRECENTGAMES) break;
                    const matchId = user_totalMatchList[i].split('_')[1];
                    const platform = user_totalMatchList[i].split('_')[0].toLowerCase();
                    const match =  matches[matchId];
                    const stat = match.participant;
                    const parsedWin = ParseWin(stat.win_my);
                    
                    let killPart = 0;
                    if(stat.total_kills) killPart = Math.round((stat.kills + stat.assists) / stat.total_kills * 100);

                    let score;
                    if(stat.deaths === 0) score = 'Perfect';
                    else score = (Math.round((stat.kills + stat.assists) * 100 / stat.deaths) / 100).toFixed(2);

                    let minCS = (Math.round((stat.minion_killed + stat.jungle_killed) * 600 / match.duration) / 10).toFixed(1);
                    let visionData = {
                        score: stat.vision_score,
                        buy: stat.wards_bought,
                        place: stat.wards_placed,
                        kill: stat.wards_killed
                    };
                    let itemHtml = ItemGen([stat.item0, stat.item1, stat.item2, stat.item3, stat.item4, stat.item5, stat.item6], FindCDN(match.start_time), visionData);

                    /** Medal */
                    let medalHtml = '';
                    if(stat.multi_kill > 1 && stat.multi_kill < 7) {
                        medalHtml += `<div class="medal"><span class="text-medal">${LANG['multi_kill_' + stat.multi_kill]}</span></div>`;
                    } else if(stat.multi_kill >= 7) {
                        medalHtml += `<div class="medal"><span class="text-medal">${stat.multi_kill + LANG['multi_kill_over']}</span></div>`;
                    }


                    /** Parse Timestamp */
                    const ts = new Date(match.start_time);
                    const month = ('0' + (ts.getMonth() + 1)).slice(-2);
                    const day = ('0' + ts.getDate()).slice(-2);

                    const dateString = month  + '-' + day;

                    let matchHtml = `<div class="recent-game-wrapper" platform="${platform}" matchId="${matchId}" timestamp="${match.start_time}">
                        <div class="recent-game recent-game-${parsedWin.winText}" team="${parsedWin.teamText}" duration="${match.duration}">`;

                    /** Header */
                    matchHtml += `
                        <div class="recent-header recent-cell">
                            <div class="recent-win ${parsedWin.winText}">
                                <div class="recent-rect ${parsedWin.winText}"></div>
                                <span class="recent-win-text">${LANG[parsedWin.winText]}</span>
                            </div>
                            <div class="recent-mini">
                                <div class="recent-duration"><span>${Math.round(match.duration/60)}:${(match.duration % 60).toString().padStart(2,'0')}</span></div>
                                <div class="recent-type"><span>${LANG['icon_' + QUEUETYPE[match.queue_id]]}</span></div>
                                <div class="recent-date"><span>${dateString}</span></div>
                            </div>
                        </div>
                        <div class="recent-champ recent-cell">
                            <img class="recent-champ-icon" src="${RIOTCDNURI + VERSION.latest}/img/champion/${CHAMPION[stat.champ_id]}.png" alt="${CHAMPION[stat.champ_id]}" title="${CHAMPION[stat.champ_id]}" />
                            <div class="shadow recent-shadow ${parsedWin.winText}"></div>
                            <div class="recent-champ-level">
                                <span class="text-level">${stat.champ_level}</span>
                            </div>
                        </div>
                        <div class="recent-runespell recent-cell">
                            <div class="recent-rune">
                                <img class="rune-main rune" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[stat.rune_main_id]}" rune-id="${stat.rune_main_id}" />
                                <img class="rune-sub rune" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[stat.rune_sub_style]}" rune-id="${stat.rune_sub_style}" />
                            </div>
                            <div class="recent-spell">
                                <img class="recent-spell-img recent-spell-first spell" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[stat.spell1_id]}.png" spell-name="${SPELL[stat.spell1_id]}"/>
                                <img class="recent-spell-img spell" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[stat.spell2_id]}.png" spell-name="${SPELL[stat.spell2_id]}"/>
                            </div>
                        </div>
                        <div class="recent-kda recent-cell">
                            <div class="recent-kda-kda">
                                <span class="text-kda">${stat.kills}</span>
                                <span>/</span><span class="text-kda">${stat.deaths}</span>
                                <span>/</span><span class="text-kda">${stat.assists}</span>
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
                                <span>${stat.minion_killed + stat.jungle_killed} (${minCS})</span>
                                <img class="icon-inline" src="/images/icon/mask-icon-cs.png" />
                            </div>
                            <div class="recent-gold">
                                <span>${stat.gold_earned.toLocaleString('ko-KR')}</span>
                                <img class="icon-inline" src="/images/icon/mask-icon-gold.png" />
                            </div>
                        </div>
                        <div class="recent-detail ${parsedWin.winText}">
                            <div class="detail-arrow">
                                <i class="detail-up arrow-${parsedWin.winText} fa fa-caret-up" style="display: none;"></i>
                                <i class="detail-down arrow-${parsedWin.winText} fa fa-caret-down"></i>
                            </div>
                        </div>
                        `;
                    
                    matchHtml += '</div><div class="recent-match match-hide"></div></div>';

                    matchesHtml += matchHtml;

                    /** Update KDA Sum */
                    killSum += stat.kills;
                    deathSum += stat.deaths;
                    assistSum  += stat.assists;
                    killTotalSum += stat.total_kills;
                }

                if(_index === 0) {
                    $("#games-recent-log").html(matchesHtml);

                    $('#kda-sum-k').text(killSum);
                    $('#kda-sum-d').text(deathSum);
                    $('#kda-sum-a').text(assistSum);
                    $('#part-sum').attr('total-kill', killTotalSum);
                } else {
                    $("#games-recent-log").append(matchesHtml);

                    $('#kda-sum-k').text(Number($('#kda-sum-k').text()) + killSum);
                    $('#kda-sum-d').text(Number($('#kda-sum-d').text()) + deathSum);
                    $('#kda-sum-a').text(Number($('#kda-sum-a').text()) + assistSum);
                    $('#part-sum').attr('total-kill', Number($('#part-sum').attr('total-kill')) + killTotalSum);
                }

                /** Update Score */
                let scoreSum = 0;
                let partSum = 0;
                let kk = Number($('#kda-sum-k').text());
                let dd = Number($('#kda-sum-d').text());
                let aa = Number($('#kda-sum-a').text());
                let tt = Number($('#part-sum').attr('total-kill'));
                if (dd === 0) scoreSum = 'Perfect';
                else scoreSum = (Math.round((kk + aa) * 100 / dd) / 100).toFixed(2);
                $('#score-sum').text(scoreSum);
                /** Update Part */
                if(tt) partSum = Math.round((kk + aa) / tt * 100);
                $('#part-sum').text(partSum + '%');

                if(isEnd) {
                    $("#recent-more").css('display', 'none');
                } else {
                    $("#recent-more").css('display', 'flex');
                    AddMoreListener();
                }

                /** Update Charts */
                UpdateVictoryCharts();
                UpdateTeamCharts();
                UpdateDurationChart();

                /** Recent Detail */
                $('.recent-game-wrapper').each((i, elem) => {
                    if(i < _index) return;
                    else if(i >= _index + MAXRECENTGAMES) return false;
            
                    $(elem).find('.recent-detail').click(async () => {
                        if($(elem).find('.recent-match').hasClass('match-hide')) {
                            $(elem).find('.recent-match').removeClass('match-hide');
                            $(elem).find('.detail-up').css('display', 'block');
                            $(elem).find('.detail-down').css('display', 'none');
                            await $(elem).find('.recent-match').html('<i class="match-loading fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>');
                            GetMatch($(elem).find('.recent-match'), {
                                platform: $(elem).attr('platform'),
                                matchId: $(elem).attr('matchId'),
                                timestamp: $(elem).attr('timestamp'),
                                miniLog: $(elem).find('.user-games-mini')
                            });
                        } else {
                            $(elem).find('.recent-match').addClass('match-hide');
                            $(elem).find('.detail-up').css('display', 'none');
                            $(elem).find('.detail-down').css('display', 'block');
                        }
                    });
                });

                /** Tooltips */
                SetTooltips();
            });
    } else {
        $("#games-recent-log").html('');
    }
}

function UpdateVictoryCharts() {
    google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var loses = $('.recent-game-Lose').length;
        var wins = $('.recent-game-Win').length;
        var data = google.visualization.arrayToDataTable([
          ['Win', 'times'],
          ['Defeat', loses],
          ['Victory', wins]
        ]);

        var options = {
          chartArea: {
            width: 150,
            height: 150
          },
          width: 150,
          height: 150,
          pieHole: 0.6,
          backgroundColor: 'whitesmoke',
          colors:['#f12f55','#22c4d5'],
          tooltip: { trigger: 'none' },
          pieSliceText: 'none',
          enableInteractivity: false,
          legend: 'none'
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart-victory'));
        chart.draw(data, options);

        $('#chart-victory-span').text(Math.round(wins * 100 /(wins + loses)) + '%');
        $('#recent-victory').text(`${wins + loses}전\t${wins}승\t${loses}패`);
      }
}

function UpdateTeamCharts() {
    google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var losesB = $('.recent-game-Lose[team=BlueTeam]').length;
        var losesR = $('.recent-game-Lose[team=RedTeam]').length;
        var winsB = $('.recent-game-Win[team=BlueTeam]').length;
        var winsR = $('.recent-game-Win[team=RedTeam]').length;
        var data = google.visualization.arrayToDataTable([
          ['team', 'Victories', 'Defeats'],
          ['Blue', winsB, losesB],
          ['Red', winsR, losesR]
        ]);

        var options = {
            chartArea: {
                width: 180,
                height: 100
              },
              height: 130,
          backgroundColor: 'whitesmoke',
          colors:['#22c4d5', '#f12f55'],
          legend: 'none',
          bar: { groupWidth: '60%' },
          isStacked: 'percent',
          hAxis: {
            minValue: 0,
            ticks: [0, .5, 1]
          }
        };

        var chart = new google.visualization.BarChart(document.getElementById('victory-team'));
        chart.draw(data, options);
      }
}

function UpdateDurationChart() {
    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        
        var games = ['games', 0, 0, 0, 0];
        var wins = ['wins', 0, 0, 0, 0];
        $('.recent-game').each((i, elem) => {
            var duration = $(elem).attr('duration');
            var i = 0;
            if(duration < 301) {
                return;
            }else if(duration < 25 * 60) {
                i = 1;
            } else if(duration < 30 * 60) {
                i = 2;
            } else if(duration < 35 * 60) {
                i = 3;
            }  else {
                i = 4;
            }
            games[i]++;
            if($(elem).hasClass('recent-game-Win')) {
                wins[i]++;
            }
        });

        var dataG = [
            ['Duration', 'Rate'],
            ['0-25', wins[1]/games[1]],
            ['25-30', wins[2]/games[2]],
            ['30-35', wins[3]/games[3]],
            ['35+', wins[4]/games[4]],
        ];

        // for(i = 1; i < 5; i++) {
        //     console.log(wins[i], games[i])
        // }

        var data = google.visualization.arrayToDataTable(dataG);

        var options = {
          
            chartArea: {
                width: 180,
                height: 100
              },
              height: 130,
          backgroundColor: 'whitesmoke',
          legend: 'none',
        //   legend: { position: 'bottom' },
        //   series: {
        //     0: {targetAxisIndex: 0},
        //     1: {targetAxisIndex: 1}
        //   },
        //   vAxes: {
        //     // Adds titles to each axis.
        //     0: {format: '#.##%'},
        //     1: {}
        //   },
          vAxis: {format: '#.##%', baseline: 0.5, baselineColor: 'red', gridlines: {minSpacing: 20}},
          dataOpacity: 0.5,
          pointSize: 5
        };

        var chart = new google.visualization.LineChart(document.getElementById('victory-duration'));

        chart.draw(data, options);
      }
}