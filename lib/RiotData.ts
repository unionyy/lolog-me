/*************  lib/RiotData.js *************
 * 
 * Patch Riot Data
 * 
 ********************************************/

const DDRRAGON_BASE_URI = "https://ddragon.leagueoflegends.com/"
const VERSION_URI = "https://ddragon.leagueoflegends.com/api/versions.json"

import { PUBLIC_LOC } from '../config.json'
import { HttpGetJson } from "./util"
import { SUPPORT_LANGS } from './constant'
import fs from 'fs'
import { ChampionDto, RuneStyleDto } from './ddragon-res'

export { RiotData }

class RiotData {
    _riotCdnUri: string = ""
    _latestVersion: string = ""
    _runes: { [index: number]: string } = {}
    _champions: { [index: string]: string } = {}

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
        if(this.latestVersion.length !== 0) {
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

    async getChampionJson(lang: string) {
        const championUri = `${this.riotCdnUri}/data/${lang}/champion.json`

        const championJson = await HttpGetJson(championUri)

        if (championJson.code !== 200) {
            console.log("Cannot get champion.json, Status Code: " + championJson.code)
            return 0
        }

        return championJson.json
    }

    async getRuneJson(lang: string) {
        const runeUri = `${this.riotCdnUri}/data/${lang}/runesReforged.json`

        const runeJson = await HttpGetJson(runeUri)

        if (runeJson.code !== 200) {
            console.log("Cannot get runesReforged.json, Status Code: " + runeJson.code)
            return 0
        }

        return runeJson.json
    }

    updateRuneList(runeJson: RuneStyleDto[]) {
        for(const runeStyle of runeJson) {
            this._runes[runeStyle.id] = runeStyle.icon
            for(const slot of runeStyle.slots) {
                for(const rune of slot.runes) {
                    this.runes[rune.id] = rune.icon
                }
            }
        }
    }

    updateRuneLang(runeJson: RuneStyleDto[], lang: string) {
        const runeLang: any = {}
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

    updateChampionList(championJson: ChampionDto) {
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
        if(this.latestVersion.length !== 0)
            fs.writeFileSync(PUBLIC_LOC + '/src/latest.version', this.latestVersion)
    }
}    
