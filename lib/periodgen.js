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
            <div id="seasons">
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2019-11-19&begin=2020-01-09">F2020</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2020-01-10&begin=2020-11-09">S2020</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2020-11-10&begin=2021-01-07">F2021</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2021-01-08">S2021</a>
                </div>
            </div>
        </div>
    `;
}