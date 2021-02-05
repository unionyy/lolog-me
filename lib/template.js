const profileGen = require('./profilegen');
const graphGen = require('./graphgen');
const logGen = require('./loggen');
const { PLATFORM_NAME } = require('./constant');

const gtag = `<!-- Global site tag (gtag.js) - Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-YMHHRQEE4G"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YMHHRQEE4G');
            </script>`;

function HTMLsearchbox(__, _selectePlatform) {
    /** Selecto Option Generator */
    var selectOptionHtml = '';
    for (platform in PLATFORM_NAME) {
        if(platform === _selectePlatform) {
            selectOptionHtml += `<option value="${platform}" selected>${PLATFORM_NAME[platform]}</option>`;
        } else {
            selectOptionHtml += `<option value="${platform}">${PLATFORM_NAME[platform]}</option>`;
        }
    }

    return `
                    <form id="searchbox" action="/search" method="post">
                        <select id="searchbox-platform" name="platform">
                            ${selectOptionHtml}
                        </select>
                        <input id="searchbox-box" type="text" name="username" placeholder="${__('input_summoner')}">
                        <input id="searchbox-button" value="${__('search')}" type="submit">
                    </form>`;
}

function HTMLtoolbar(__, _selectePlatform) {
    return`
                <div id="toolbar">
                    <h1 id="toolbar-title"><a href="/">LoLog.me</a></h1>
                    ${HTMLsearchbox(__, _selectePlatform)}
                </div>
    `;
}

module.exports = {
    HTMLindex: function (__, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html>
            <head>
                <title>LoLog.me</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/css/title.css">
                <link rel="stylesheet" href="/css/reset.css">
                ${gtag}
            </head>
            <body>
                <div id="title-main">
                    <h1 id="title-title"><a href="/">LoLog.me</a></h1>
                    ${HTMLsearchbox(__, _selectePlatform)}
                </div>
            </body>
        </html>
        `
    },
    HTMLuser: function(_data, __, _selectePlatform) {
        // total, start, end, profilehtml, datehtml
        var profileHtml = profileGen.Gen(_data.userData, __);
        var graphHtml = graphGen.Gen(__);
        var logHtml = logGen.Gen(_data.gameData, __);
        return`
        <!DOCTYPE html>
        <html>
            <head>
                <title>${_data.userData.real_name} - LoLog.me</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="/src/graphmod.js"></script>
                <script type="text/javascript" src="/tooltipster/tooltipster.bundle.min.js"></script>
                <script type="text/javascript" src="/tooltipster/tooltipster-follower.min.js"></script>
                <script>
                    $(document).ready(function() {
                        $('.day').tooltipster({
                            theme: 'tooltipster-borderless',
                            plugins: ['follower'],
                            anchor: 'bottom-center',
                            offset: [0, 10],
                            arrow: true
                        });
                        $('.user-games-game').tooltipster({
                            theme: 'tooltipster-borderless',
                            plugins: ['follower'],
                            anchor: 'bottom-center',
                            offset: [0, 10],
                            arrow: true
                        });
                    });
                </script>

                <link rel="stylesheet" type="text/css" href="/tooltipster/tooltipster.bundle.min.css" />
                <link rel="stylesheet" type="text/css" href="/tooltipster/tooltipster-follower.min.css" />
                <link rel="stylesheet" type="text/css" href="/tooltipster/tooltipster-sideTip-borderless.min.css" />
                <link rel="stylesheet" type="text/css" href="/css/graph.css">
                <link rel="stylesheet" type="text/css" href="/css/reset.css">
        
                ${gtag}
            </head>
            <body>
                ${HTMLtoolbar(__, _selectePlatform)}
                <div id="user-content">
                    
                    ${profileHtml}

                    <div id="user-graph">
                        <div id="user-graph-header">
                            <div>
                                <span id="username-total">???</span><span id="username-period"> (???~???)</span></div>
                            <div></div>
                            <form id="type-check" onchange='Change(false, "${__('game_count')}");'>
                                <input type="checkbox" id="solo" name="Solo" value="solo" checked>
                                <label for="solo">${__('ranked_solo')}</label>
                                <input type="checkbox" id="flex" name="Flex" value="flex" checked>
                                <label for="flex">${__('ranked_flex')}</label>
                                <input type="checkbox" id="norm" name="Norm" value="norm" checked>
                                <label for="norm">${__('normal')}</label>
                                <input type="checkbox" id="aram" name="Aram" value="aram" checked>
                                <label for="aram">${__('aram')}</label>
                                <input type="checkbox" id="urf" name="URF" value="urf" checked>
                                <label for="urf">URF</label>
                                <input type="checkbox" id="ai" name="AI" value="ai" checked>
                                <label for="ai">${__('ai')}</label>
                                <input type="checkbox" id="etc" name="etc" value="etc" checked>
                                <label for="etc">${__('etc')}</label>
                            </form>
                        </div>
                        ${graphHtml}
                    </div>
                    ${logHtml}
                    <script src="/src/datecal.js"></script>
                    <script>Change(true, "${__('game_count')}");</script>
                </div>
            </body>
        </html>
        `
    },
    HTMLnouser: function(_userName, __, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html>

            <head>
                <title>LoLog.me</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/css/graph.css">
                <link rel="stylesheet" href="/css/reset.css">
                ${gtag}
            </head>
            <body>
                ${HTMLtoolbar(__, _selectePlatform)}
                <h2 class="no-user">"${_userName}" ${__('user_not_found')}</h2>
            </body>
        </html>
        `
    },
    HTML404: function(__, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html>

            <head>
                <title>LoLog.me</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/css/graph.css">
                <link rel="stylesheet" href="/css/reset.css">
                ${gtag}
            </head>
            <body>
                ${HTMLtoolbar(__, _selectePlatform)}
                <h2 class="no-user">${__('404_msg')}</h2>
            </body>
        </html>
        `
    }
}