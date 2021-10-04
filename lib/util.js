const sanitizedHtml = require('sanitize-html');

module.exports.NormalizeName = function (name) {
    var username = name;
    username = username.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
    username = username.replace(/ /g,'');
    username = username.toLowerCase();
    username = sanitizedHtml(username);
    return username;
}