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
                        console.log("old");
                        resolve(results[0]);
                    } else {
                        console.log("new");
                        resolve(false);
                    }
                } else {
                    console.log('no results');
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
                        console.log("old");
                        resolve(results[0]);
                    } else {
                        console.log("new");
                        resolve(false);
                    }
                } else {
                    console.log('no results');
                    resolve(false);
                }
                
            });
    });
}

module.exports.GetGames = function (_id_my) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM games WHERE id_my=?`,
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
            `UPDATE norm_name=?, platform_my=?, update_time=NOW(), account_id=?, summoner_id=?, real_name=?, profile_icon_id=?, summoner_level=?, solo_tier=?, solo_rank=?, solo_lp=?, solo_wins=?, solo_losses=?, flex_tier=?, flex_rank=?, flex_lp=?, flex_wins=?, flex_losses=?`,
            [_data.norm_name, _data.platform_my, _data.account_id, _data.summoner_id, _data.real_name, _data.profile_icon_id, _data.summoner_level, _data.solo_tier, _data.solo_rank, _data.solo_lp, _data.solo_wins, _data.solo_losses, _data.flex_tier, _data.flex_rank, _data.flex_lp, _data.flex_wins, _data.flex_losses],
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
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [_data.id_my, _data.game_id, _data.time_int, _data.platform_my, _data.champion, _data.queue_type, _data.lane_my],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports.InputDates = function (normname, date, plays) {
    return new Promise((resolve, reject,) => {
        db.query(
            `INSERT INTO dates (normname, playdate, total, solo, flex, norm, aram, urf, ai) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [normname, date, plays.total, plays.Solo, plays.Flex, plays.Norm, plays.ARAM, plays.URF, plays.AI],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
    });
}

module.exports.InputGames = function (normname, date, champ, type, game_id) {
    return new Promise((resolve, reject,) => {
        db.query(
            `INSERT INTO games (normname, playdate, champ, gametype, yourgg_game_id) 
            VALUES(?, ?, ?, ?, ?)`,
            [normname, date, champ, type, game_id],
            (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
    });
}

module.exports.DeleteUser = function (normname) {
    return new Promise((resolve, reject,) => {
        db.query(
            `DELETE FROM users WHERE normname=?`,
            [normname],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results['affectedRows'] === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    console.log(`User Delete Err: ${normname}`);
                }
            });
    });
}

module.exports.DeleteDates = function (normname) {
    return new Promise((resolve, reject,) => {
        db.query(
            `DELETE FROM dates WHERE normname=?`,
            [normname],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results['affectedRows'] === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    console.log(`Dates Delete Err: ${normname}`);
                }
            });
    });
}

module.exports.DeleteGames = function (normname) {
    return new Promise((resolve, reject,) => {
        db.query(
            `DELETE FROM games WHERE normname=?`,
            [normname],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results['affectedRows'] === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    console.log(`Games Delete Err: ${normname}`);
                }
            });
    });
}

module.exports.GetUpdatetime = function (normname) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT updatetime FROM users WHERE normname=?`,
            [normname],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results[0]) {
                        resolve(results[0]['updatetime']);
                    } else {
                        resolve(false);
                    } 
                } else {
                    console.log(`select: ${normname}`);
                    resolve(false);
                }
            });
    });
}

module.exports.GetProfileHtml = function (normname) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT profile FROM users WHERE normname=?`,
            [normname],
            (err, results) => {
                if(err) {
                    reject(err);
                } else if(results) {
                    if(results[0]) {
                        resolve(results[0]['profile']);
                    } else {
                        resolve(false);
                    } 
                } else {
                    console.log(`select user: ${normname}`);
                    resolve(false);
                }
            });
    });
}

module.exports.GetDates = function (normname) {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM dates WHERE normname=?`,
            [normname],
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
                    console.log(`select dates: ${normname}`);
                    resolve(false);
                }
            });
    });
}

