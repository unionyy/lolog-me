const profileGen = require('./profilegen');
const periodGen = require('./periodgen');
const graphGen = require('./graphgen');
const logGen = require('./loggen');
const { PLATFORM_NAME, RIOTCDNURI, PLATFORMS } = require('./constant');

var gtag = `
<!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N35GSHZ');</script>
        <!-- End Google Tag Manager -->`;

//         <!-- Global site tag (gtag.js) - Google Analytics -->
//         <script async src="https://www.googletagmanager.com/gtag/js?id=G-YMHHRQEE4G"></script>
//         <script>
//             window.dataLayer = window.dataLayer || [];
//             function gtag() { dataLayer.push(arguments); }
//             gtag('js', new Date());
            
//             gtag('config', 'G-YMHHRQEE4G');
//         </script>

//         <!-- Global AdSense -->
//         <script data-ad-client="ca-pub-6916694174053190" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
// `;

function HTMLlangIcon(__, _nonce) {
    return `
    <select id="lang-select">
        <option value="${__('lang_value')}">${__('lang_text')}</option>
        <option value="ko">한국어</option>
        <option value="en">English</option>
    </select>
    <script nonce="${_nonce}">
        $('#lang-select').change(function() {
            location.href='?lang='+this.value;
        })
    </script>
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

                        <input id="searchbox-box" class="recent-pop" type="text" name="username" placeholder="${__('input_summoner')}" autocomplete="off" required="true" />
                        
                        <button id="searchbox-button"><i class="fa fa-search" aria-hidden="true"></i></button>
                        
                        <div id="recent-users" class="recent-pop"><div id="recent-container"></div></div>
                    </form>
                    `;
                    //<input id="searchbox-button" value="${__('search')}" type="submit">
}

function HTMLtoolbar(__, _selectePlatform, _nonce) {
    return`
                <div id="toolbar">
                    <div id="toolbar-logo">
                        <a href="/"><img src="/images/logo.svg" alt="LoLog.me"></a>
                    </div>
                    ${HTMLsearchbox(__, _selectePlatform)}
                    ${HTMLlangIcon(__, _nonce)}
                </div>
    `;
}

function HTMLfooter(__) {
    return `
    <div id="footer">
        <p>
            Beta.
            <a href="https://blog.uniony.me" target="_blank">${__('dev-blog')}</a><br>
        </p>
        <p id="copyright">
            © 2021 Uniony. All rights reserved. LoLog.me isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
        </p>
    </div>`;
}

function HTMLheads(_title, _description, _keywords, _url, _locale) {
    return `
        <title>${_title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="keywords" content="${_keywords}" />
        <meta name="title" content="${_title}" />
        <meta name="description" content="${_description}" />
        <meta name="author" content="Uniony" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${_title}" />
        <meta property="og:site_name" content="LoLog.me" />
        <meta property="og:description" content="${_description}" />
        <meta property="og:image" content="https://lolog.me/images/logo.svg" />
        <meta property="og:url" content="${_url}" />
        <meta property="og:locale" content="${_locale}" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" href="/favicon/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#38b259" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="canonical" href="${_url}" />
        <link rel="alternate" hreflang="x-default" href="${_url}" />
        <link rel="alternate" hreflang="ko" href="${_url}?lang=ko" />
        <link rel="alternate" hreflang="en" href="${_url}?lang=en" />

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <script src="/src/cookie.js"></script>
        <script src="/src/recentusers.js"></script>

        <style>
            body {
                font-size: 16px;
            }
        </style>

        <link rel="stylesheet" href="/css/searchbox.css">
        <link rel="stylesheet" href="/css/footer.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        
        ${gtag}`;
}

module.exports = {
    RemoveGtag() {
        gtag = '';
        console.log('Gtag Removed');
        return;
    },
    HTMLindex: function (__, _selectePlatform, _nonce) {
        return`
<!DOCTYPE html>
<html lang="${__('lang_value')}">

    <head>
        ${HTMLheads(__('title_main'), __('description_main'), __('keywords_main'), 'https://lolog.me/', __('locale'))}
        <link rel="stylesheet" href="/css/title.css">
        <link rel="stylesheet" href="/css/reset_title.css">
    </head>

    <body>
        <div id="wrapper">

            <div id="title-toolbar">
                <div></div>
                ${HTMLlangIcon(__, _nonce)}
            </div>

            <div id="title-main">
                <div id="title-title">
                    <h1><a href="/"><img id="title-logo" src="/images/logo.svg" alt="LoLog.me"></a></h1>
                </div>
                ${HTMLsearchbox(__, _selectePlatform)}
            </div>

            ${HTMLfooter(__)}
        </div>
    </body>
</html>
`
    },
    HTMLuser: function(_data, __, _selectePlatform, _begin, _end, _nonce) {
        if(_begin === undefined) _begin = '???';
        if(_end === undefined) _end = '???';

        var profileHtml = profileGen.Gen(_data.userData, __);
        var periodHtml = periodGen.Gen(_data.userData, _begin, _end);
        var graphHtml = graphGen.Gen(__, _begin, _end, periodHtml);
        var logHtml = logGen.Gen(_data.gameData, __, _nonce);
        return`
<!DOCTYPE html>
<html lang="${__('lang_value')}">
    <head>

        ${HTMLheads(_data.userData.real_name + ' - LoLog.me', _data.userData.real_name + __('description_user'), __('keywords_main')+ ', ' + _data.userData.norm_name, `https://lolog.me/${PLATFORMS[_data.userData.platform_my]}/user/${_data.userData.norm_name}`, __('locale'))}

        
        <script src="/src/graphmod.js"></script>
        <script src="/src/hidelog.js"></script>
        <script src="/src/hidesetting.js"></script>
        <script src="/src/graphdraw.js"></script>
        <script src="/src/logdraw.js"></script>
        <script src="/lang/${__('lang_value')}.js"></script>

        <script type="text/javascript" src="/tooltipster/tooltipster.bundle.min.js"></script>
        <script type="text/javascript" src="/tooltipster/tooltipster-follower.min.js"></script>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script src="/src/tooltipster.js"></script>

        <link rel="stylesheet" type="text/css" href="/tooltipster/tooltipster.bundle.min.css" />
        <link rel="stylesheet" type="text/css" href="/tooltipster/tooltipster-follower.min.css" />
        <link rel="stylesheet" type="text/css" href="/tooltipster/tooltipster-sideTip-borderless.min.css" />
        <link rel="stylesheet" type="text/css" href="/css/template.css">
        <link rel="stylesheet" type="text/css" href="/css/user.css">
        <link rel="stylesheet" type="text/css" href="/css/reset_template.css">
        <link rel="stylesheet" type="text/css" href="/css/reset_user.css">

    </head>

    <body>
        <div id="wrapper">

            ${HTMLtoolbar(__, _selectePlatform, _nonce)}

            <div id="content">
                ${profileHtml}
                ${graphHtml}
                <div id="charts" class="in-box">
                    <div id="charts-lane-wrapper">
                        <div id="charts-lane"></div>
                        <img id="charts-lane-img">
                    </div>
                    <div id="charts-champ-wrapper">
                        <div id="charts-champ"></div>
                        <img id="charts-champ-img" srcuri="${RIOTCDNURI}">
                    </div>
                </div>
                ${logHtml}
                <script nonce="${_nonce}">
                    DrawGraph('${_begin}', '${_end}', '${_nonce}');
                    DrawLog('${RIOTCDNURI}');
                </script>
                <script src="/src/datecal.js"></script>
                <script nonce="${_nonce}">
                    Change(true, "${__('game_count')}");
    
                    $('#user-games-refresh').click(function() {
                        $(this).attr('date', 'all');
                        Change(false, '${__('game_count')}');
                    })

                    $('#user-games-header .fa-caret-up').click(HideLog);
                    $('#user-games-header .fa-caret-down').click(ShowLog);

                    $('#btn-hidesetting').click(HideSetting);
                    $('#btn-showsetting').click(ShowSetting);

                    $('#type-check').change(function() {
                        Change(false, "${__('game_count')}");
                    });
                </script>
            </div>

            ${HTMLfooter(__)}

        </div>
    </body>
</html>`
    },
    HTMLmatch: function(_matchId, __, _selectePlatform, _nonce) {
        /** HAVE TO ADD URL in HTMLheads*/
        return`
        <!DOCTYPE html>
        <html lang="${__('lang_value')}">

            <head>
                ${HTMLheads(__('title_main'), __('description_main'), __('keywords_main'), __('locale'))}

                <link rel="stylesheet" href="/css/template.css">
                <link rel="stylesheet" href="/css/reset_template.css">
                </head>
            <body>
            <div id="wrapper">
                ${HTMLtoolbar(__, _selectePlatform, _nonce)}
                <h2 id="msg-text">${__('not_support_yet')}<br><br><a href="https://matchhistory.kr.leagueoflegends.com/#match-details/${_selectePlatform.toUpperCase()}/${_matchId}?tab=overview">${__('show_on_riot')}</a></h2>
                ${HTMLfooter(__)}
            </div>
            </body>
        </html>
        `
    },
    HTMLmsg: function(_msg, __, _selectePlatform, _nonce) {
        return`
<!DOCTYPE html>
<html lang="${__('lang_value')}">
    <head>
        ${HTMLheads(__('title_main'), __('description_main'), __('keywords_main'), "https://lolog.me/", __('locale'))}
        <link rel="stylesheet" href="/css/template.css">
        <link rel="stylesheet" href="/css/reset_template.css">
    </head>

    <body>
        <div id="wrapper">
            ${HTMLtoolbar(__, _selectePlatform, _nonce)}
            <h2 id="msg-text">${_msg}</h2>
            ${HTMLfooter(__)}
        </div>
    </body>
</html>`;
    }
}