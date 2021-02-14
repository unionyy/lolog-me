const profileGen = require('./profilegen');
const periodGen = require('./periodgen');
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

function HTMLlangIcon(__) {
    return `
    <select id="lang-select" onchange="location.href='/lang-'+this.value;">
        <option value="${__('lang_value')}">${__('lang_text')}</option>
        <option value="ko">한국어</option>
        <option value="en">English</option>
    </select>
    `
}

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
                    <form id="searchbox" action="/search" method="get">
                        
                        <button id="searchbox-button"><i class="fa fa-search" aria-hidden="true"></i></button>

                        <input id="searchbox-box" type="text" name="username" placeholder="${__('input_summoner')}">
                        
                        <select id="searchbox-platform" name="platform">
                            ${selectOptionHtml}
                        </select>
                        
                    </form>`;
                    //<input id="searchbox-button" value="${__('search')}" type="submit">
}

function HTMLtoolbar(__, _selectePlatform) {
    return`
                <div id="toolbar">
                    <div id="toolbar-logo">
                        <a href="/"><img src="/images/logo.svg"></a>
                    </div>
                    ${HTMLsearchbox(__, _selectePlatform)}
                    ${HTMLlangIcon(__)}
                </div>
    `;
}

function HTMLfooter(__) {
    return `<div id="footer"><p>© 2021 Uniony. DEMO</p></div>`;
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
                <link rel="stylesheet" href="/css/reset_title.css">
                <link rel="stylesheet" href="/css/searchbox.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                ${gtag}
            </head>
            <body>
            <div id="wrapper">
                <div id="title-toolbar">
                    <div></div>
                    ${HTMLlangIcon(__)}
                </div>

                <div id="title-main">
                    <div id="title-title"><a href="/"><img id="title-logo" src="/images/logo.svg"></a></div>
                    
                    ${HTMLsearchbox(__, _selectePlatform)}
                </div>
                ${HTMLfooter(__)}
            </div>
            </body>
        </html>
        `
    },
    HTMLuser: function(_data, __, _selectePlatform, _begin, _end, _offset) {
        var profileHtml = profileGen.Gen(_data.userData, __);
        var periodHtml = periodGen.Gen(_data.userData);
        var graphHtml = graphGen.Gen(__, _begin, _end);
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
                <script src="/src/hidelog.js"></script>
                <script type="text/javascript" src="/tooltipster/tooltipster.bundle.min.js"></script>
                <script type="text/javascript" src="/tooltipster/tooltipster-follower.min.js"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
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
                <link rel="stylesheet" type="text/css" href="/css/template.css">
                <link rel="stylesheet" type="text/css" href="/css/user.css">
                <link rel="stylesheet" type="text/css" href="/css/searchbox.css">
                <link rel="stylesheet" type="text/css" href="/css/reset_template.css">
                <link rel="stylesheet" type="text/css" href="/css/reset_user.css">
        
                ${gtag}
            </head>
            <body>
            <div id="wrapper">
                ${HTMLtoolbar(__, _selectePlatform)}
                <div id="content">
                    
                    ${profileHtml}
                    ${periodHtml}
                    ${graphHtml}
                    ${logHtml}
                    
                    <script src="/src/datecal.js"></script>
                    <script>Change(true, "${__('game_count')}");</script>
                </div>
                ${HTMLfooter(__)}
            </div>
            </body>
        </html>
        `
    },
    HTMLmsg: function(_msg, __, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html>

            <head>
                <title>LoLog.me</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/css/template.css">
                <link rel="stylesheet" href="/css/searchbox.css">
                <link rel="stylesheet" href="/css/reset_template.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                ${gtag}
            </head>
            <body>
            <div id="wrapper">
                ${HTMLtoolbar(__, _selectePlatform)}
                <h2 id="msg-text">${_msg}</h2>
                ${HTMLfooter(__)}
            </div>
            </body>
        </html>
        `
    }
}