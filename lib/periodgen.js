const { PLATFORMS } = require('./constant');

module.exports.Gen = function(_userData) {
    const min = new Date(new Date() - 62985600000).toISOString().slice(0, 10);
    return `
        <div id="period">
            <form id="period-selector" action="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}" method="get">
                <input id="period-selector-end" type="date" min="${min}" name="end">
                ~ 
                <input id="period-selector-begin" type="date" min="${min}" name="begin">
                <button id="period-button"><i class="fa fa-search" aria-hidden="true"></i></button>
            </form>
            <div id="period-buttons">
                <a class="period-button" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2019-11-19&begin=2020-01-09">2020 Free Season</a>
                <a class="period-button" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2020-01-10&begin=2020-11-09">2020 Season</a>
                <a class="period-button" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2020-11-10&begin=2021-01-07">2021 Free Season</a>
                <a class="period-button" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2021-01-08">2021 Season</a>
            </div>
        </div>
    `;
}