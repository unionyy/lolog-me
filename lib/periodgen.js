const { PLATFORMS } = require('./constant');

module.exports.Gen = function(_userData) {
    const min = new Date(new Date() - 62985600000).toISOString().slice(0, 10);
    return `
        <form id="period-selector" action="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}" method="get">
            <input id="period-selector-end" type="date" min="${min}" name="end">
             ~ 
            <input id="period-selector-begin" type="date" min="${min}" name="begin">
            <button id="period-button"><i class="fa fa-search" aria-hidden="true"></i></button>
        </form>
    `;
}