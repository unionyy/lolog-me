/*************  lib/shortcut.js *************
 * 
 * Return json type shortcut data
 * 
 ********************************************/

import * as riotData from './riot-data';

export async function GetSummonerShortcut(_normName: string, _platform: string) {
    const summoner = await riotData.SearchSummonerName(_normName, _platform);
    if(!summoner) return false;

    let matchList: any = await riotData.SearchMatchList(summoner.puuid, _platform);
    matchList = matchList.slice(0, 5);

    const matches = await riotData.SearchMatches(summoner.id_my, matchList);

    summoner.matches = [];
    for(const matchId of matchList) {
        const matchIdNum = matchId.split('_')[1];
        if(matches[matchIdNum]) {
            summoner.matches.push(matches[matchIdNum]);
        }
    }

    delete summoner.puuid;
    delete summoner.summoner_id;
    delete summoner.account_id;
    delete summoner.norm_name;

    return summoner;
}