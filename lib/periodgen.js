const { PLATFORMS } = require('./constant');

module.exports.Gen = function(_userData) {
    return `
        <form id="period-selector" action="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}" method="get">
            <input id="period-selector-end" type="date" min="2019-02-15" name="end">
             ~ 
            <input id="period-selector-begin" type="date" min="2019-02-15" name="begin">
            <button id="period-button"><i class="fa fa-search" aria-hidden="true"></i></button>
        </form>
    `;
}