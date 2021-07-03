const mysql = require('mysql');
const config_data = require('../secure/db.json');
const { PLATFORM_MY } = require('./constant');
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

module.exports.GetUser = function (_normName, _platform, _cols = '*') {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT ${_cols} FROM users WHERE norm_name=? AND platform_my=?`,
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

module.exports.GetUserAccountId = function (_accountId, _platform, _select) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT ${_select} FROM users WHERE platform_my=? AND account_id=?`,
            [PLATFORM_MY[_platform], _accountId],
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
            `UPDATE users SET explore_idx=?, update_time_g=NOW() WHERE puuid=?`,
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
            VALUES(?, ?, FROM_UNIXTIME(?), ?, ?, ?, ?) ON DUPLICATE KEY UPDATE champion=champion`,
            [_data.id_my, _data.game_id, _data.play_time, _data.platform_my, _data.champion, _data.queue_type, _data.lane_my],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.InputGameMulti = function (_games) {
    return new Promise((resolve, reject,) => {
        var queryString =`INSERT INTO games (id_my, game_id, play_time, platform_my, champion, queue_type, lane_my) 
            VALUES`;
        var data = [];

        for(game of _games) {
            queryString += ` (?, ?, FROM_UNIXTIME(?), ?, ?, ?, ?),`
            data.push(game.id_my, game.game_id, game.play_time, game.platform_my, game.champion, game.queue_type, game.lane_my)
        }

        queryString = queryString.slice(0, -1);
        queryString +=  `AS new ON DUPLICATE KEY UPDATE lane_my=new.lane_my`;

        db.query(
            queryString,
            data,
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.InputParticipants = function (_games) {
    return new Promise((resolve, reject,) => {
        var queryString =`INSERT INTO participants VALUES`;
        var data = [];

        for(game of _games) {
            var gs = game.stats;
            queryString += ` (?,?,?,?,?,?,?,?,?,?,  ?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?),` // 29 cols
            data.push(game.id_my, game.game_id, game.duration, game.win_my, game.total_kills, game.spell1, game.spell2,
                gs.champLevel, gs.rune0, gs.rune1);
            data.push(...gs.items);
            data.push(gs.kills, gs.deaths, gs.assists, gs.minions, gs.jungle, gs.gold,
                gs.multiKill, gs.visionScore, gs.wardsBought, gs.wardsPlaced, gs.wardsKilled, game.best_player);
        }

        queryString = queryString.slice(0, -1);
        queryString +=  `ON DUPLICATE KEY UPDATE win_my = win_my`;

        db.query(
            queryString,
            data,
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.GetParticipants = function (_id_my, _gameIds) {
    return new Promise((resolve, reject,) => {
        var gameIdString = ''
        for (id of _gameIds) {
            gameIdString += id + ',';
        }
        gameIdString = gameIdString.slice(0, -1);

        db.query(
            `SELECT * FROM participants WHERE id_my=? AND game_id IN (${gameIdString})`,
            [_id_my],
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
                    resolve(false);
                }
            });
    });
}
