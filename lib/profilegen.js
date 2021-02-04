module.exports.Gen = function(_userData) {
    var ratio_solo;
    if(_userData.solo_tier !== 'Unranked') {
        ratio_solo = (_userData.solo_wins * 100/(_userData.solo_wins + _userData.solo_losses)).toFixed(2)
    } else {
        ratio_solo = 0;
    }

    var ratio_flex;
    if(_userData.flex_tier !== 'Unranked') {
        ratio_flex = (_userData.flex_wins * 100/(_userData.flex_wins + _userData.flex_losses)).toFixed(2)
    } else {
        ratio_flex = 0;
    }
    
    return `<div id="user-profile">
                <div id="user-profile-bio">
                    <div id="user-profile-bio-img">
                        <img src="https://ddragon.leagueoflegends.com/cdn/11.2.1/img/profileicon/${_userData.profile_icon_id}.png">
                    </div> 
                    <div id="user-profile-bio-name">
                        <div id="user-profile-bio-grid">
                            <span id="user-profile-name">${_userData.real_name}</span>
                            <form id="user-profile-refresh" action="/fsearch" method="post">
                                <input type="hidden" name="username" value="${_userData.norm_name}">
                                <input value="업데이트" type="submit">
                            </form>
                        </div>
                    </div>
                </div>
                <div></div>
                <div id="user-ranks">
                    <div class="profile-rank">
                        <img src="/icon/${_userData.solo_tier}.png">
                        <div class="profile-rank-text">
                            <div class="profile-rank-text-grid">
                                <span class="gg-sub-title">솔로랭크</span>
                                <span class="text-${_userData.solo_tier} mt-1">${_userData.solo_tier}</span>
                                <span class="mt-1">${ratio_solo}% ${_userData.solo_lp}lp</span>
                                <span>
                                    <span class="text-success">${_userData.solo_wins}W</span>
                                    <span class="text-warning">${_userData.solo_losses}L</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="profile-rank">
                        <img src="/icon/${_userData.flex_tier}.png">
                        <div class="profile-rank-text">
                            <div class="profile-rank-text-grid">
                                <span class="gg-sub-title">자유랭크</span>
                                <span class="text-${_userData.flex_tier} mt-1">${_userData.flex_tier}</span>
                                <span class="mt-1">${ratio_flex}% ${_userData.flex_lp}lp</span>
                                <span>
                                    <span class="text-success">${_userData.flex_wins}W</span>
                                    <span class="text-warning">${_userData.flex_losses}L</span>
                                </span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>`;
}