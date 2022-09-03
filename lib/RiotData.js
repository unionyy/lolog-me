/*************  lib/RiotData.js *************
 * 
 * Patch Riot Data
 * 
 ********************************************/

const DDRRAGON_BASE_URI = "https://ddragon.leagueoflegends.com/"
const VERSION_URI = "https://ddragon.leagueoflegends.com/api/versions.json"
const { PUBLIC_LOC } = require('../config.json')
const { HttpGetJson } = require("./util")
const { SUPPORT_LANGS } = require('./constant')
const fs = require('fs')


module.exports = {
    RiotData : class {
        _riotCdnUri = ""
        _latestVersion = ""
        _runes = {}
        _champions = {}
    
        constructor() {
        }
    
        async initialize() {
            await this.patch()
            return
        }
    
        get riotCdnUri() {
            return this._riotCdnUri
        }

        get latestVersion() {
            return this._latestVersion
        }

        get champions() {
            return this._champions
        }

        get runes() {
            return this._runes
        }
    
        async patch() {
            console.log("Riot Data Patch Start")
            this._latestVersion = await this.getVersion()
            if(this.latestVersion !== 0) {
                this._riotCdnUri = DDRRAGON_BASE_URI + "cdn/" + this.latestVersion

                console.log("Riot Cdn Updated: " + this.riotCdnUri)
            }

            let newChampionJson = await this.getChampionJson('en_US')
            if(newChampionJson !== 0) {
                this.updateChampionList(newChampionJson)

                console.log("Champion List Updated: " + Object.keys(this.champions).length + " Champions")
            }
            let newRuneJson = await this.getRuneJson('en_US')
            if(newRuneJson !== 0) {
                this.updateRuneList(newRuneJson)

                console.log("Rune List Updated: " + Object.keys(this.runes).length + " Runes")
            }

            this.updatePublicData()
            
            for(const lang of SUPPORT_LANGS) {
                const json = await this.getRuneJson(lang)
                if(json !== 0) {
                    this.updateRuneLang(json, lang)
                }
            }
            console.log("Riot Data Patch End")

            return
        }
    
        async getVersion() {
            const versionJson = await HttpGetJson(VERSION_URI)
    
            if (versionJson.code !== 200) {
                console.log("Cannot get version.json, Status Code: " + versionJson.code)
                return 0
            }
    
            return versionJson.json[0]
        }

        async getChampionJson(lang) {
            const championUri = `${this.riotCdnUri}/data/${lang}/champion.json`

            const championJson = await HttpGetJson(championUri)

            if (championJson.code !== 200) {
                console.log("Cannot get champion.json, Status Code: " + championJson.code)
                return 0
            }
    
            return championJson.json
        }

        async getRuneJson(lang) {
            const runeUri = `${this.riotCdnUri}/data/${lang}/runesReforged.json`

            const runeJson = await HttpGetJson(runeUri)

            if (runeJson.code !== 200) {
                console.log("Cannot get runesReforged.json, Status Code: " + runeJson.code)
                return 0
            }

            return runeJson.json
        }

        updateRuneList(runeJson) {
            for(const runeStyle of runeJson) {
                this._runes[runeStyle.id] = runeStyle.icon
                for(const slot of runeStyle.slots) {
                    for(const rune of slot.runes) {
                        this.runes[rune.id] = rune.icon
                    }
                }
            }
        }

        updateRuneLang(runeJson, lang) {
            const runeLang = {}
            for(const runeStyle of runeJson) {
                runeLang[runeStyle.id] = {
                    name: runeStyle.name
                }
                for(const slot of runeStyle.slots) {
                    for(const rune of slot.runes) {
                        this.runes[rune.id] = rune.icon
                        runeLang[rune.id] = {
                            name: rune.name,
                            description: rune.longDesc
                        }
                    }
                }
            }
            if(Object.keys(runeLang).length > 0)
                fs.writeFileSync(`${PUBLIC_LOC}/lang/${lang}/rune.json`, JSON.stringify(runeLang))
        }

        updateChampionList(championJson) {
            const champions = championJson.data
            for(const elem in champions) {
                this.champions[champions[elem].key] = champions[elem].id;
            }
        }

        updatePublicData() {
            if(Object.keys(this.champions).length > 0)
                fs.writeFileSync(PUBLIC_LOC + '/src/champion.json', JSON.stringify(this.champions))
            if(Object.keys(this.runes).length > 0)
                fs.writeFileSync(PUBLIC_LOC + '/src/rune.json', JSON.stringify(this.runes))
            if(this.latestVersion !== 0)
                fs.writeFileSync(PUBLIC_LOC + '/src/latest.version', this.latestVersion)
        }
    }    
}
