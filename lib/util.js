/***********  lib/util.js ***********
 * 
 * Util functions
 * 
 **** export functions ****
 * NormalizeName(_name)
 * VerifyMatchId(_matchId)
 ***********************************/


const sanitizedHtml = require('sanitize-html');
const urlencode = require('urlencode');
const { PLATFORM_MY } = require('./constant');

module.exports.NormalizeName = function (_name) {
    let userName = _name;
    if(userName.length > 50) userName = userName.slice(0, 50);
    userName = userName.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
    userName = userName.replace(/ /g,'');
    userName = userName.toLowerCase();
    userName = sanitizedHtml(userName);
    return userName;
}

module.exports.VerifyMatchId = function(_matchId) {
    try{
      const matchId = urlencode.decode(_matchId);
      const splitedMatchId = matchId.split('_');
      const platform = splitedMatchId[0].toLowerCase();
      if(PLATFORM_MY[platform] === undefined) return false;
      if(isNaN(splitedMatchId[1])) return false;
    } catch(err) {
      return false;
    }
    return true;
  }