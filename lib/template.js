const profileGen = require('./profilegen');
const graphGen = require('./graphgen');
const logGen = require('./loggen');

const gtag = `<!-- Global site tag (gtag.js) - Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-YMHHRQEE4G"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YMHHRQEE4G');
            </script>`;

module.exports = {
    HTMLindex: function () {
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
                    
                    <form id="title-search" action="/search" method="post">
                        <input id="title-search-box" type="text" name="username" placeholder="소환사명을 입력하세요">
                        <input id="title-search-button" value="검색" type="submit">
                    </form>
                </div>
            </body>
        </html>
        `
    },
    HTMLuser: function(_data) {
        // total, start, end, profilehtml, datehtml
        var profileHtml = profileGen.Gen(_data.userData);
        var graphHtml = graphGen.Gen();
        var logHtml = logGen.Gen(_data.gameData);
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
                <div id="user-main">
                    <h1 id="user-title"><a href="/">LoLog.me</a></h1>
                    <form id="user-search" action="/search" method="post">
                        <input id="user-search-box" type="text" name="username" placeholder="소환사명을 입력하세요">
                        <input id="user-search-button" value="검색" type="submit">
                    </form>
                </div>

                <div id="user-content">
                    
                    ${profileHtml}

                    <div id="user-graph">
                        <div id="user-graph-header">
                            <div>
                                <span id="username-total">???판</span><span id="username-period"> (???~???)</span></div>
                            <div></div>
                            <form id="type-check" onchange='Change();'>
                                <input type="checkbox" id="solo" name="Solo" value="solo" checked>
                                <label for="solo">솔로랭크</label>
                                <input type="checkbox" id="flex" name="Flex" value="flex" checked>
                                <label for="flex">자유랭크</label>
                                <input type="checkbox" id="norm" name="Norm" value="norm" checked>
                                <label for="norm">일반모드</label>
                                <input type="checkbox" id="aram" name="Aram" value="aram" checked>
                                <label for="aram">칼바람</label>
                                <input type="checkbox" id="urf" name="URF" value="urf" checked>
                                <label for="urf">URF</label>
                                <input type="checkbox" id="ai" name="AI" value="ai" checked>
                                <label for="ai">AI대전</label>
                                <input type="checkbox" id="etc" name="etc" value="etc" checked>
                                <label for="etc">etc</label>
                            </form>
                        </div>
                        ${graphHtml}
                    </div>
                    ${logHtml}
                    <script src="/src/datecal.js"></script>
                    <script>Change(true);</script>
                </div>
            </body>
        </html>
        `
    },
    HTMLnouser: function(username) {
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
                <div id="user-main">
                    <h1 id="user-title"><a href="/">LoLog.me</a></h1>
                    <form id="user-search" action="/search" method="post">
                        <input id="user-search-box" type="text" name="username" placeholder="소환사명을 입력하세요">
                        <input id="user-search-button" value="검색" type="submit">
                    </form>
                </div>
                <h2 class="no-user">"${username}" 유저를 찾을 수 없습니다</h2>
            </body>
        </html>
        `
    }
}