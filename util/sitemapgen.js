const mysql = require('mysql');
const {PLATFORMS } = require('../lib/constant')
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

async function Init() {
    await handleDisconnect().catch(err => {
        throw err;
    });
}

function GetUsers() {
    return new Promise((resolve, reject,) => {
        db.query(
            `SELECT * FROM users `,
            (err, results) => {
                if(err) {
                    reject(err);
                }else if(results) {
                    resolve(results);
                } else {
                    resolve(false);
                }
                
            });
    });
}

var fs = require('fs');



Init();
var sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://lolog.me/</loc>
<lastmod>2021-02-26</lastmod>
</url>\n
`;
GetUsers().then(users=> {
    for(user of users) {
        if(user.norm_name === null) {
            continue;
        }
        var url = `https://lolog.me/${PLATFORMS[user.platform_my]}/user/${user.norm_name}`;
        sitemap += `<url><loc>${url}</loc>`;

        var date = new Date(user.update_time).toISOString().slice(0, 10);
        sitemap += `<lastmod>${date}</lastmod></url>\n`

        console.log(date, url);
    }
    sitemap += '</urlset>';

    fs.writeFile('public/sitemap.xml', sitemap, 'utf8', function(error){
        console.log('write end')
    });
})