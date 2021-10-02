/*************  dbio.js *************
 * 
 * Communicate with MySQL DB
 * 
 ** Export Functions
 *
 * Init
 * 
 * GetSummonerByName
 * GetSummonerByPUUID
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
 ***********************************/

const mysql = require('mysql');
const config_data = require('../secure/db.json');
var db_config = {
    host: config_data['mysqlhost'],
    user: config_data['mysqluser'],
    password: config_data['mysqlpw'],
    database: config_data['database'],
    insecureAuth : true,
    supportBigNumbers: true,
    charset: 'utf8mb4'
}
var db;

function handleDisconnect() {
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
module.exports.Init = async function () {
    await handleDisconnect().catch(err => {
        throw err;
    });
}

/**************** SUMMONERS IOs ****************/
/* Get Summoner by Normalized Name & Platform */
module.exports.GetSummonerByName = function (_normName, _platform, _cols = '*') {
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
module.exports.GetSummonerByPUUID = function (_puuid) {
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
/* Input Summoner */
module.exports.InputSummoner = function (_data) {
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
module.exports.UpdateSummoner = function (_data) {
    return new Promise((resolve, reject,) => {
        db.query(
            `UPDATE summoners SET
            norm_name=?, platform_my=?, update_time=NOW(),
            account_id=?, summoner_id=?,
            summoner_name=?, profile_icon_id=?, summoner_level=?,
            solo_tier=?, solo_rank=?, solo_lp=?, solo_wins=?, solo_losses=?, solo_mini_prog,
            flex_tier=?, flex_rank=?, flex_lp=?, flex_wins=?, flex_losses=?, flex_mini_prog
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
module.exports.InputSummonersSimple = function (_summoners) {
    if(_summoners.length === 0) return new Promise((resolve, reject) => {resolve([]);});
    const data = [];
    let queryString = `INSERT IGNORE INTO summoners (
        platform_my,
        summoner_id, puuid,
        summoner_name, profile_icon_id, summoner_level)
        VALUES`;
    
    for(const summoner of _summoners) {
        queryString += `(?,  ?,?,  ?,?,?),`;
        data.push(summoner.platform_my,
            summoner.summoner_id, summoner.puuid,
            summoner.summonser_name, summoner.profile_icon_id, summoner.summoner_level);
    }

    queryString = queryString.slice(0, -1);
    queryString +=  `AS new ON DUPLICATE KEY UPDATE puuid=new.puuid`;
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
module.exports.CheckSummonersByPUUID = function (_puuids) {
    if(_puuids.length === 0) return new Promise((resolve, reject) => {resolve([]);});
    let puuidsString = "";
    let data = [];
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
                    if(results[0]) resolve(results);
                    else resolve(false);
                } else {
                    resolve(false);
                }
            });
    });
}

/**************** MATCHES IOs ****************/
/* Get Matches by match_id and platform_my */
module.exports.GetMatches = function (_matchIds) {
    if(_matchIds.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let matchIdsString = "";
    let data = [];
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
module.exports.InputMatches = function(_matches) {
    if(_matches.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let matchesString = "";
    let data = [];
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
module.exports.GetParticipants = function (_id_my, _matchIds) {
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
module.exports.GetParticipantsOfMatch = function (_matchId) {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM participants WHERE match_id=? AND platform_my=?`,
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
module.exports.InputParticipants = function (_participants) {
    if(_participants.length === 0) return new Promise((resolve, reject) => {resolve([]);});

    let participantsString = "";
    let data = [];
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