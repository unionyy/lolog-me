const { RIOTCDNURI } = require("./constant");

const ICONURI = RIOTCDNURI + '/img/profileicon/';

module.exports.Gen = function(_userData, __) {
    var ratio_solo;
    var class_solo = ['text-wins', 'text-losses'];
    if(_userData.solo_tier !== 'Unranked') {
        ratio_solo = (_userData.solo_wins * 100/(_userData.solo_wins + _userData.solo_losses)).toFixed(2)
    } else {
        ratio_solo = 0;
        class_solo = ['text-inactive', 'text-inactive'];
    }
    var rank_solo;
    switch(_userData.solo_tier) {
        case 'Unranked':
        case 'MASTER':
        case 'GRANDMASTER':
        case 'CHANLLENGER':
            rank_solo = '';
            break;
        default:
            rank_solo = ' ' + _userData.solo_rank;
            break;
    }

    var ratio_flex;
    var class_flex = ['text-wins', 'text-losses'];
    if(_userData.flex_tier !== 'Unranked') {
        ratio_flex = (_userData.flex_wins * 100/(_userData.flex_wins + _userData.flex_losses)).toFixed(2)
    } else {
        ratio_flex = 0;
        var class_flex = ['text-inactive', 'text-inactive'];
    }

    var rank_flex;
    switch(_userData.flex_tier) {
        case 'Unranked':
        case 'MASTER':
        case 'GRANDMASTER':
        case 'CHANLLENGER':
            rank_flex = '';
            break;
        default:
            rank_flex = ' ' + _userData.flex_rank;
            break;
    }
    
    return `<div id="user-profile" class="in-box">
                <div id="user-profile-bio">
                    <div id="user-profile-bio-img">
                        <img src="${ICONURI + _userData.profile_icon_id}.png" alt="Profile Icon">
                    </div>
                    <div id="user-profile-bio-grid">
                        <h1 id="user-profile-name" accountId="${_userData.account_id}">${_userData.real_name}</h1>
                        <form id="user-profile-refresh" action="/update" method="get">
                            <input type="hidden" name="username" value="${_userData.norm_name}">
                            <input type="hidden" name="platform" value="${_userData.platform_my}">
                            <button id="update-button" value="${__('update')}" type="submit">${__('update')}</button>
                        </form>
                    </div>
                </div>
                <div id="user-ranks">
                    <div class="profile-rank">
                        <img src="/icon/${_userData.solo_tier}.png" alt="${_userData.solo_tier}">
                        <div class="profile-rank-text">
                            <div class="profile-rank-text-grid">
                                <span class="text-rank-title">${__('ranked_solo')}</span>
                                <span class="text-tier text-${_userData.solo_tier}">${_userData.solo_tier} ${rank_solo}</span>
                                <span class="text-ratio">${ratio_solo}% ${_userData.solo_lp}lp</span>
                                <span>
                                    <span class="${class_solo[0]}">${_userData.solo_wins}W</span>
                                    <span class="${class_solo[1]}">${_userData.solo_losses}L</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="profile-rank">
                        <img src="/icon/${_userData.flex_tier}.png" alt="${_userData.flex_tier}">
                        <div class="profile-rank-text">
                            <div class="profile-rank-text-grid">
                                <span class="text-rank-title">${__('ranked_flex')}</span>
                                <span class="text-tier text-${_userData.flex_tier}">${_userData.flex_tier} ${rank_flex}</span>
                                <span class="text-ratio">${ratio_flex}% ${_userData.flex_lp}lp</span>
                                <span>
                                    <span class="${class_flex[0]}">${_userData.flex_wins}W</span>
                                    <span class="${class_flex[1]}">${_userData.flex_losses}L</span>
                                </span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>`;
}