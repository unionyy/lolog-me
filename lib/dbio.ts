/*************  lib/dbio.js *************
 * 
 * Communicate with MySQL DB
 * 
 ** Export Functions
 *
 * Init
 * 
 * GetSummonerByName
 * GetSummonerByPUUID
 * GetSummonerByIdMy
 * InputSummoner
 * UpdateSummoner
 * InputSummonersSimple
 * CheckSummonersByPUUID
 * 
 * GetMatches
 * InputMatches
 * 
 * GetParticipants
 * GetParticipantsOfMatch
 * InputParticipants
 * 
 ***************************************/

import mysql from 'mysql';

export { Init, GetSummonerByName, GetSummonerByPUUID, 
    GetSummonerByidMy, InputSummoner, UpdateSummoner,
    InputSummonersSimple,  CheckSummonersByPUUID, GetMatches,
    InputMatches, GetParticipants, GetParticipantsOfMatch,
    InputParticipants, }

const { MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB } = require('../config.json');
var db_config = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PW,
    database: MYSQL_DB,
    insecureAuth : true,
    supportBigNumbers: true,
    charset: 'utf8mb4'
}
var db: mysql.Connection;

function handleDisconnect(): Promise<void> {
    return new Promise((resolve, reject,) => {
        db = mysql.createConnection(db_config);

        db.connect(err => {
            if (err) {
                console.log('Cannnot connect to MySQL', err);
                setTimeout(handleDisconnect, 2000);
            } else {
                console.log('DB Connected');
                resolve();
            }
        });

        db.on('error', err => {
            console.log('MySQL error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                handleDisconnect();
            } else {
                reject(err);
            }
        });
    });
}

/** Initialize DBIO (Connect to MySQL Server) */
async function Init () {
    await handleDisconnect().catch(err => {
        throw err;
    });
}

/**************** SUMMONERS IOs ****************/
/* Get Summoner by Normalized Name & Platform */
function GetSummonerByName(_normName: string, _platform: number, _cols: string = '*') {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT ${_cols} FROM summoners WHERE norm_name=? AND platform_my=?`,
            [_normName, _platform],
            (err, results) => {
                if(err) {
                    reject(err);
                }else if(results) {
                    if(results[0]) {
                        resolve(results[0]);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
                
            });
    });
}
/* Get Summoner by PUUID */
function GetSummonerByPUUID(_puuid: string) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM summoners WHERE puuid=?`,
            [_puuid],
            (err, results) => {
                if(err) {
                    reject(err);
                }else if(results) {
                    if(results[0]) {
                        resolve(results[0]);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
                
            });
    });
}
/* Get Summoner by id_my */
function GetSummonerByidMy(_idMy: number) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM summoners WHERE id_my=?`,
            [_idMy],
            (err, results) => {
                if(err) {
                    reject(err);
                }else if(results) {
                    if(results[0]) {
                        resolve(results[0]);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
                
            });
    });
}
/* Input Summoner */
function InputSummoner(_data: any) {
    return new Promise((resolve, reject,) => {
        db.query(
            `INSERT IGNORE INTO summoners (
            norm_name, platform_my, update_time,
            account_id, summoner_id, puuid,
            summoner_name, profile_icon_id, summoner_level,
            solo_tier, solo_rank, solo_lp, solo_wins, solo_losses, solo_mini_prog,
            flex_tier, flex_rank, flex_lp, flex_wins, flex_losses, flex_mini_prog) 
            VALUES(?,?,NOW(),  ?,?,?,  ?,?,?,  ?,?,?, ?,?,?,  ?,?,?,?,?,?)`,
            [_data.norm_name, _data.platform_my,
            _data.account_id, _data.summoner_id, _data.puuid,
            _data.summoner_name, _data.profile_icon_id, _data.summoner_level,
            _data.solo_tier, _data.solo_rank, _data.solo_lp, _data.solo_wins, _data.solo_losses, _data.solo_mini_prog,
            _data.flex_tier, _data.flex_rank, _data.flex_lp, _data.flex_wins, _data.flex_losses, _data.flex_mini_prog],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}
/* Update Summoner */
function UpdateSummoner(_data: any) {
    return new Promise((resolve, reject,) => {
        db.query(
            `UPDATE summoners SET
            norm_name=?, platform_my=?, update_time=NOW(),
            account_id=?, summoner_id=?,
            summoner_name=?, profile_icon_id=?, summoner_level=?,
            solo_tier=?, solo_rank=?, solo_lp=?, solo_wins=?, solo_losses=?, solo_mini_prog=?,
            flex_tier=?, flex_rank=?, flex_lp=?, flex_wins=?, flex_losses=?, flex_mini_prog=?
            WHERE puuid=?`,
            [_data.norm_name, _data.platform_my,
            _data.account_id, _data.summoner_id,
            _data.summoner_name, _data.profile_icon_id, _data.summoner_level,
            _data.solo_tier, _data.solo_rank, _data.solo_lp, _data.solo_wins, _data.solo_losses, _data.solo_mini_prog,
            _data.flex_tier, _data.flex_rank, _data.flex_lp, _data.flex_wins, _data.flex_losses, _data.flex_mini_prog,
            _data.puuid],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}
/* Simply Input Summoners for Get id_my */
function InputSummonersSimple(_summoners: any) {
    if(_summoners.length === 0) return new Promise((resolve, reject) => {resolve([]);});
    const data: any = [];
    let queryString = `INSERT IGNORE INTO summoners (
        platform_my, update_time,
        summoner_id, puuid,
        summoner_name, profile_icon_id, summoner_level)
        VALUES`;
    
    for(const summoner of _summoners) {
        queryString += `(?,0,  ?,?,  ?,?,?),`;
        data.push(summoner.platform_my,
            summoner.summoner_id, summoner.puuid,
            summoner.summoner_name, summoner.profile_icon_id, summoner.summoner_level);
    }

    queryString = queryString.slice(0, -1);
    return new Promise((resolve, reject,) => {
        db.query(
            queryString,
            data,
            (err, results) => {
                if(err) reject(err);
                else resolve(results);
            });
    });
}
/* Check Summoners Exits or Not & Get id_my */
function CheckSummonersByPUUID(_puuids: string[]) {
    if(_puuids.length === 0) return new Promise((resolve, reject) => {resolve([]);});
    let puuidsString = "";
    let data: string[] = [];
    for(const puuid of _puuids) {
        puuidsString += '?,';
        data.push(puuid);
    }
    puuidsString = puuidsString.slice(0, -1);

    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT id_my, puuid FROM summoners WHERE puuid IN (${puuidsString})`,
            data,
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(Array.isArray(results)) resolve(results);
                    else resolve([results]);
                } else {
                    resolve([]);
                }
            });
    });
}

/**************** MATCHES IOs ****************/
/* Get Matches by match_id and platform_my */
function GetMatches(_matchIds: any) {
    if(_matchIds.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let matchIdsString = "";
    let data: any = [];
    for(const matchId of _matchIds) {
        matchIdsString += '(?,?),';
        data.push(matchId.match_id, matchId.platform_my);
    }
    matchIdsString = matchIdsString.slice(0, -1);
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM matches WHERE (match_id, platform_my) IN (${matchIdsString})`,
            data,
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results[0]) resolve(results);
                    else resolve(false); 
                } else {
                    resolve(false);
                }
            });
    });
}
/* Input Matches */
function InputMatches(_matches: any) {
    if(_matches.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let matchesString = "";
    let data: any = [];
    for(const match of _matches) {
        matchesString += "(?,?,FROM_UNIXTIME(?),?,?),";
        data.push(match.match_id, match.platform_my,
            match.start_time, match.duration, match.queue_id);
    }
    matchesString = matchesString.slice(0, -1);
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT IGNORE INTO matches (match_id, platform_my,
                start_time, duration, queue_id)
                VALUES ${matchesString}`,
            data,
            (err, result) => {
                if(err) reject(err);
                else resolve(result);
            }
        )
    });
}

/**************** PARTICIPANTS IOs ****************/
/* Get Participants by id_my and multiple match_id */
function GetParticipants(_id_my: number, _matchIds: any) {
    if(_matchIds.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let matchIdsString = "";
    let data = [_id_my];
    for(const matchId of _matchIds) {
        matchIdsString += "(?,?),";
        data.push(matchId.match_id, matchId.platform_my);
    }
    matchIdsString = matchIdsString.slice(0, -1);
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM participants WHERE id_my=? AND ((match_id, platform_my) IN (${matchIdsString}))`,
            data,
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results[0]) resolve(results);
                    else resolve(false); 
                } else {
                    resolve(false);
                }
            }
        )
    });
}
/* Get Participants of Match by match_id */
function GetParticipantsOfMatch(_matchId: any) {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT participants.*, summoners.summoner_name FROM participants LEFT OUTER JOIN summoners ON participants.id_my = summoners.id_my WHERE match_id=? AND participants.platform_my=?`,
            [_matchId.match_id, _matchId.platform_my],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results[0]) resolve(results);
                    else resolve(false); 
                } else {
                    resolve(false);
                }
            }
        )
    });
}
/* Input Participants */
function InputParticipants(_participants: any) {
    if(_participants.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let participantsString = "";
    let data: any = [];
    for(const pt of _participants) {
        participantsString += `(?,?, 
            ?,?,
            ?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,
            ?,?,?,?,?),`;
        data.push(pt.id_my, pt.match_id,
            pt.win_my, pt.total_kills,
            pt.champ_id, pt.champ_level,
            pt.spell1_id, pt.spell2_id, pt.rune_main_id, pt.rune_sub_style, pt.position_my,
            pt.kills, pt.deaths, pt.assists, pt.item0, pt.item1, pt.item2, pt.item3, pt.item4, pt.item5, pt.item6,
            pt.minion_killed, pt.jungle_killed, pt.gold_earned, pt.damage_champ, pt.damage_total, pt.multi_kill,
            pt.vision_score, pt.wards_bought, pt.wards_placed, pt.wards_killed, pt.wards_placed_detector);
    }
    participantsString = participantsString.slice(0, -1);
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT IGNORE INTO participants (id_my, match_id,
                win_my, total_kills,
                champ_id, champ_level, spell1_id, spell2_id, rune_main_id, rune_sub_style, position_my,
                kills, deaths, assists, item0, item1, item2, item3, item4, item5, item6,
                minion_killed, jungle_killed, gold_earned, damage_champ, damage_total, multi_kill,
                vision_score, wards_bought, wards_placed, wards_killed, wards_placed_detector)
                VALUES ${participantsString}`,
            data,
            (err, result) => {
                if(err) reject(err);
                else resolve(result);
            }
        )
    });
}