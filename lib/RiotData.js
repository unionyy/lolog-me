/*************  lib/RiotData.js *************
 * 
 * Patch Riot Data
 * 
 ********************************************/

const DDRRAGON_BASE_URI = "https://ddragon.leagueoflegends.com/"
const VERSION_URI = "https://ddragon.leagueoflegends.com/api/versions.json"

module.exports = {
    RiotData : class {
        riotCdnUri = "x"
        champions = {}
    
        constructor() {
        }
    
        async initialize() {
            await this.patch()
            return
        }
    
        get riotCdnUri() {
            return this.riotCdnUri
        }

        get champions() {
            return this.champions
        }
    
        async patch() {
            let newVersion = await this.getVersion()
            if(newVersion !== 0) {
                this.riotCdnUri = DDRRAGON_BASE_URI + "cdn/" + newVersion

                console.log("Riot Cdn Updated: " + this.riotCdnUri)
            }

            let newChampionJson = await this.getChampionJson('en_US')
            if(newChampionJson !== 0) {
                this.updateChampionList(newChampionJson)

                console.log("Champion List Updated: " + Object.keys(this.champions).length + " Champions")
            }
            return
        }
    
        async getVersion() {
            const { HttpGetJson } = require("./util")

            const versionJson = await HttpGetJson(VERSION_URI)
    
            if (versionJson.code != 200) {
                console.log("Cannot get version.json, Status Code: " + versionJson.code)
                return 0
            }
    
            return versionJson.json[0]
        }

        async getChampionJson(lang) {
            const { HttpGetJson } = require("./util");

            const championUri = this.riotCdnUri + "/data/" + lang + "/champion.json"

            const championJson = await HttpGetJson(championUri)

            if (championJson.code != 200) {
                console.log("Cannot get champion.json, Status Code: " + versionJson.code)
                return 0
            }
    
            return championJson.json
        }

        updateChampionList(championJson) {
            const champions = championJson.data
            for(const elem in champions) {
                this.champions[champions[elem].key] = champions[elem].name;
            }
        }
    }    
}
