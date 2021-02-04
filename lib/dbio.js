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

module.exports.Init = async function () {
    await handleDisconnect().catch(err => {
        throw err;
    });
}

module.exports.GetUser = function (_normName, _platform) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM users WHERE norm_name=? AND platform_my=?`,
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

module.exports.GetUserPuuid = function (_puuid) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM users WHERE puuid=?`,
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

module.exports.GetGames = function (_id_my, _begin, _end) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM games WHERE id_my=? AND play_time < FROM_UNIXTIME(?) AND play_time > FROM_UNIXTIME(?)`,
            [_id_my, _begin, _end],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results[0]) {
                        resolve(results);
                    } else {
                        resolve(false);
                    } 
                } else {
                    console.log(`select games: ${_id_my}`);
                    resolve(false);
                }
            });
        });
    }
    

module.exports.InputUser = function (_data) {
    return new Promise((resolve, reject,) => {
        db.query(
            `INSERT INTO users (norm_name, platform_my, update_time, explore_idx, account_id, summoner_id, puuid, real_name, profile_icon_id, summoner_level, solo_tier, solo_rank, solo_lp, solo_wins, solo_losses, flex_tier, flex_rank, flex_lp, flex_wins, flex_losses) 
            VALUES(?, ?, NOW(), 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [_data.norm_name, _data.platform_my, _data.account_id, _data.summoner_id, _data.puuid, _data.real_name, _data.profile_icon_id, _data.summoner_level, _data.solo_tier, _data.solo_rank, _data.solo_lp, _data.solo_wins, _data.solo_losses, _data.flex_tier, _data.flex_rank, _data.flex_lp, _data.flex_wins, _data.flex_losses],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.UpdateUser = function (_data) {
    return new Promise((resolve, reject,) => {
        db.query(
            `UPDATE users SET norm_name=?, platform_my=?, update_time=NOW(), account_id=?, summoner_id=?, real_name=?, profile_icon_id=?, summoner_level=?, solo_tier=?, solo_rank=?, solo_lp=?, solo_wins=?, solo_losses=?, flex_tier=?, flex_rank=?, flex_lp=?, flex_wins=?, flex_losses=? WHERE puuid=?`,
            [_data.norm_name, _data.platform_my, _data.account_id, _data.summoner_id, _data.real_name, _data.profile_icon_id, _data.summoner_level, _data.solo_tier, _data.solo_rank, _data.solo_lp, _data.solo_wins, _data.solo_losses, _data.flex_tier, _data.flex_rank, _data.flex_lp, _data.flex_wins, _data.flex_losses, _data.puuid],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.RemoveNameUser = function (_puuid) {
    return new Promise((resolve, reject,) => {
        db.query(
            `UPDATE users SET norm_name=NULL WHERE puuid=?`,
            [_puuid],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.UpdateUserExp = function (_idx, _puuid) {
    return new Promise((resolve, reject,) => {
        db.query(
            `UPDATE users SET explore_idx=? WHERE puuid=?`,
            [_idx, _puuid],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.InputGame = function (_data) {
    return new Promise((resolve, reject,) => {
        db.query(
            `INSERT INTO games (id_my, game_id, play_time, platform_my, champion, queue_type, lane_my) 
            VALUES(?, ?, FROM_UNIXTIME(?), ?, ?, ?, ?) ON DUPLICATE KEY UPDATE champion=?`,
            [_data.id_my, _data.game_id, _data.play_time, _data.platform_my, _data.champion, _data.queue_type, _data.lane_my, _data.champion],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}