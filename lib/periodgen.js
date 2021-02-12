module.exports.Gen = function(_userData) {
    return `
        <a href="/kr/user/${_userData.norm_name}?begin=${new Date(2021, 0, 1).valueOf()}&end=${new Date(2020, 0, 1).valueOf()}">2020</a>
        <a href="/kr/user/${_userData.norm_name}?begin=${new Date(2020, 0, 1).valueOf()}&end=${new Date(2019, 0, 1).valueOf()}">2019</a>
    `;
}