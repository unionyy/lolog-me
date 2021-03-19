const { PLATFORMS } = require('./constant');

module.exports.Gen = function(_userData, _begin, _end) {
    const min = new Date(new Date() - 62985600000).toISOString().slice(0, 10);
    const mon6 = new Date(new Date() - 15768000000).toISOString().slice(0, 10);

    function SelectStr(__end, __begin) {
        if(__begin === _begin && __end === _end) {
            return 'selected';
        }else {
            return '';
        }
    }

    return `
        <div id="period">
            <div id="seasons">
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2019-11-19&begin=2020-01-09" ${SelectStr('2019-11-19', '2020-01-09')}>F2020</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2020-01-10&begin=2020-11-09" ${SelectStr('2020-01-10', '2020-11-09')}>S2020</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2020-11-10&begin=2021-01-07" ${SelectStr('2020-11-10', '2021-01-07')}>F2021</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=2021-01-08" ${SelectStr('2021-01-08', '???')}>S2021</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=${mon6}" ${SelectStr(mon6, '???')}>0.5 Year</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}" ${SelectStr('???', '???')}>1 Year</a>
                </div>
                <div class="seasons-button">
                    <a class="seasons-link" href="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}?end=${min}" ${SelectStr(min, '???')}>2 Years</a>
                </div>
            </div>
            <form id="period-selector" action="/${PLATFORMS[_userData.platform_my]}/user/${_userData.norm_name}" method="get">
                <input id="period-selector-end" type="date" min="${min}" name="end">
                ~ 
                <input id="period-selector-begin" type="date" min="${min}" name="begin">
                <button id="period-button"><i class="fa fa-search" aria-hidden="true"></i></button>
            </form>
        </div>
    `;
}