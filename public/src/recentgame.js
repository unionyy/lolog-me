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
    if($('.cur-game').length > 0) {
        var queryStr = '?';
        $('.cur-game').each((i, elem) => {
            if(i < _index) return;
            else if(i >= _index + MAXRECENTGAMES) {
                isEnd = false;
                return false;
            }
    
            var q = 'm='+$(elem).attr('matchid')+'&';
            queryStr += q;
        });
        queryStr = queryStr.slice(0, -1);
    
        var uri = `/${$('#user-platform').attr('value')}/user/${$('#user-name').attr('value')}/detail${queryStr}`;
    
        fetch(uri)
            .then(response => response.json(), err => {$("#user-games-recent").html('<span class="recent-fail">Try Again</span>');})
            .then(data => {

                var gamesHtml = '';

                var killSum = 0;
                var deathSum = 0;
                var assistSum = 0;
                var killTotalSum = 0;

                for(elem of data.data) {
                    var parsedWin = ParseWin(elem.win_my);
                    var mini = $(`.cur-game[matchid=${elem.game_id}]`);
                    var gameHtml = `<div class="recent-game-wrapper" platform="${mini.attr('platform')}" matchId="${mini.attr('matchId')}" timestamp="${mini.attr('timestamp')}">
                        <div class="recent-game recent-game-${parsedWin.winText}" team="${parsedWin.teamText}" duration="${elem.duration}">`;
        
                    var killPart = 0;
                    if(elem.total_kills) killPart = Math.round((elem.kills + elem.assists) / elem.total_kills * 100);

                    var score;
                    if(elem.deaths === 0) score = 'Perfect';
                    else score = (Math.round((elem.kills + elem.assists) * 100 / elem.deaths) / 100).toFixed(2);

                    var minCS = (Math.round((elem.minions + elem.jungle) * 600 / elem.duration) / 10).toFixed(1);

                    var timestamp = mini.attr('timestamp');
                    var visionData = {
                        score: elem.vision_score,
                        buy: elem.wards_bought,
                        place: elem.wards_placed,
                        kill: elem.wards_killed
                    };
                    var itemHtml = ItemGen([elem.item0, elem.item1, elem.item2, elem.item3, elem.item4, elem.item5, elem.item6], FindCDN(timestamp), visionData);

                    /** Medal */
                    var medalHtml = '';

                    // Killing Spree
                    var mki = ''; // Multi Kill Icon
                    switch(elem.multi_kill) {
                        case 0:
                        case 1: break;
                        default: mki = 'kill' + elem.multi_kill; break;
                    }
                    if(elem.multi_kill > 5) {
                        mki = 'kill5';
                    }
                    if(mki) {
                        medalHtml = `<div class="medal">`;
                        medalHtml += `<img class="medal-icon tooltip" src="/images/kill/${mki}.png" title="${LANG['multi_kill_' + elem.multi_kill]}" />`;
                        medalHtml += `</div>`;
                    }
                    
                    // if(elem.multi_kill > 1 && elem.multi_kill < 7) {
                    //     medalHtml += `<div class="medal"><span class="text-medal">${LANG['multi_kill_' + elem.multi_kill]}</span></div>`;
                    // } else if(elem.multi_kill >= 7) {
                    //     medalHtml += `<div class="medal"><span class="text-medal">${elem.multi_kill + LANG['multi_kill_over']}</span></div>`;
                    // }

                    /** Header */
                    gameHtml += `
                        <div class="recent-header recent-cell">
                            <div class="recent-win ${parsedWin.winText}">
                                <div class="recent-rect ${parsedWin.winText}"></div>
                                <span class="recent-win-text">${LANG[parsedWin.winText]}</span>
                            </div>
                            <div class="recent-mini">
                                <div class="recent-duration"><span>${Math.round(elem.duration/60)}:${(elem.duration % 60).toString().padStart(2,'0')}</span></div>
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
                                <img class="rune-main rune" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.rune0]}" rune-id="${elem.rune0}" />
                                <img class="rune-sub rune" src="https://ddragon.leagueoflegends.com/cdn/img/${RUNE[elem.rune1]}" rune-id="${elem.rune1}" />
                            </div>
                            <div class="recent-spell">
                                <img class="recent-spell-img recent-spell-first spell" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell1]}.png" spell-name="${SPELL[elem.spell1]}"/>
                                <img class="recent-spell-img spell" src="${RIOTCDNURI + VERSION.latest}/img/spell/${SPELL[elem.spell2]}.png" spell-name="${SPELL[elem.spell2]}"/>
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
                        `;
                    
                    gameHtml += '</div><div class="recent-match match-hide"></div></div>';

                    gamesHtml += gameHtml;

                    /** Update KDA Sum */
                    killSum += elem.kills;
                    deathSum += elem.deaths;
                    assistSum  += elem.assists;
                    killTotalSum += elem.total_kills;
                }

                if(_index === 0) {
                    $("#games-recent-log").html(gamesHtml);

                    $('#kda-sum-k').text(killSum);
                    $('#kda-sum-d').text(deathSum);
                    $('#kda-sum-a').text(assistSum);
                    $('#part-sum').attr('total-kill', killTotalSum);
                } else {
                    $("#games-recent-log").append(gamesHtml);

                    $('#kda-sum-k').text(Number($('#kda-sum-k').text()) + killSum);
                    $('#kda-sum-d').text(Number($('#kda-sum-d').text()) + deathSum);
                    $('#kda-sum-a').text(Number($('#kda-sum-a').text()) + assistSum);
                    $('#part-sum').attr('total-kill', Number($('#part-sum').attr('total-kill')) + killTotalSum);
                }

                /** Update Score */
                var scoreSum = 0;
                var partSum = 0;
                var kk = Number($('#kda-sum-k').text());
                var dd = Number($('#kda-sum-d').text());
                var aa = Number($('#kda-sum-a').text());
                var tt = Number($('#part-sum').attr('total-kill'));
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