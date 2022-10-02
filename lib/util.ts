/***********  lib/util.js ***********
 *
 * Util functions
 *
 **** export functions ****
 * NormalizeName(_name)
 * VerifyMatchId(_matchId)
 ***********************************/

import sanitizedHtml from "sanitize-html";
import urlencode from "urlencode";
import { PLATFORM_MY } from "./constant";

export function NormalizeName(_name: string) {
  let userName = _name;
  if (userName.length > 50) userName = userName.slice(0, 50);
  userName = userName.replace(
    /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,
    ""
  );
  userName = userName.replace(/ /g, "");
  userName = userName.toLowerCase();
  userName = sanitizedHtml(userName);
  return userName;
};

export function VerifyMatchId(_matchId: string) {
  try {
    const matchId = urlencode.decode(_matchId);
    const splitedMatchId = matchId.split("_");
    const platform = splitedMatchId[0].toLowerCase();
    if (PLATFORM_MY[platform] === undefined) return false;
    if (splitedMatchId[1].length === 0) return false;
  } catch (err) {
    return false;
  }
  return true;
};

export async function HttpGetJson(_uri: string) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    https.get(_uri, (res: any) => {
      res.setEncoding("utf-8");

      var _res = "";
      res.on("data", (d: any) => {
        //process.stdout.write(d); // If you want to print res
        _res += d;
      });
      res.on("end", () => {
        if (_res) {
          if(res.statusCode == 200) {
            resolve({ code: res.statusCode, json: JSON.parse(_res) });
          } else {
            resolve({ code: res.statusCode, data: _res });
          }
        } else {
          reject();
        }
      });
    });
  });
};
