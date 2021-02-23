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
                    
                        <select id="searchbox-platform" name="platform">
                            ${selectOptionHtml}
                        </select>   

                        <input id="searchbox-box" type="text" name="username" placeholder="${__('input_summoner')}">
                        
                        <button id="searchbox-button"><i class="fa fa-search" aria-hidden="true"></i></button>
                        
                        
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
    return `<div id="footer"><p>© 2021 Uniony. All rights reserved. DEMO</p></div>`;
}

function HTMLheads(_title, _description, _keywords) {
    return `
    <title>${_title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="keywords" content="${_keywords}">
    <meta name="title" content="${_title}">
    <meta name="description" content="${_description}">
    <meta name="author" content="Uniony">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${_title}">
    <meta property="og:site_name" content="LoLog.me">
    <meta property="og:description" content="${_description}">
    <meta property="og:image" content="https://lolog.me/images/logo.svg">
    <meta property="og:url" content="https://lolog.me">

    <link rel="canonical" href="https://lolog.me">
    <link rel="icon" type="image/x-icon" href="/images/icon.svg">

    <style>
        body {
            font-size: 16px;
        }
    </style>
    
    `;
}

module.exports = {
    HTMLindex: function (__, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html lang="${__('lang_value')}">
            <head>
                ${HTMLheads(__('title_main'), __('description_main'), __('keywords_main'))}

                <link rel="stylesheet" href="/css/title.css">
                <link rel="stylesheet" href="/css/reset_title.css">
                <link rel="stylesheet" href="/css/searchbox.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                ${gtag}
                <script data-ad-client="ca-pub-6916694174053190" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
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
        <html lang="${__('lang_value')}">
            <head>
                <title>${_data.userData.real_name} - LoLog.me</title>
                
                ${HTMLheads(_data.userData.real_name + ' - LoLog.me', _data.userData.real_name + __('description_user'), __('keywords_main')+ ' ' + _data.userData.norm_name)}

                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="/src/graphmod.js"></script>
                <script src="/src/hidelog.js"></script>
                <script type="text/javascript" src="/tooltipster/tooltipster.bundle.min.js"></script>
                <script type="text/javascript" src="/tooltipster/tooltipster-follower.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.5.6/dist/frappe-charts.min.iife.js"></script>
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
    HTMLmatch: function(_matchId, __, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html lang="${__('lang_value')}">

            <head>
                ${HTMLheads(__('title_main'), __('description_main'), __('keywords_main'))}

                <link rel="stylesheet" href="/css/template.css">
                <link rel="stylesheet" href="/css/searchbox.css">
                <link rel="stylesheet" href="/css/reset_template.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                ${gtag}
            </head>
            <body>
            <div id="wrapper">
                ${HTMLtoolbar(__, _selectePlatform)}
                <h2 id="msg-text">${__('not_support_yet')}<br><br><a href="https://matchhistory.kr.leagueoflegends.com/#match-details/${_selectePlatform.toUpperCase()}/${_matchId}?tab=overview">${__('show_on_riot')}</a></h2>
                ${HTMLfooter(__)}
            </div>
            </body>
        </html>
        `
    },
    HTMLmsg: function(_msg, __, _selectePlatform) {
        return`
        <!DOCTYPE html>
        <html lang="${__('lang_value')}">

            <head>
                ${HTMLheads(__('title_main'), __('description_main'), __('keywords_main'))}

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