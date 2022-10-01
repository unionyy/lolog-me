/*************  lib/constant.js *************
 * 
 * Constants
 * 
 **** export objects ****
 * QUEUETYPE
 * PLATFORM_MY
 * PLATFORMS
 * PLATFORM_NAME
 * PLATFORM_ROUTING
 * POSITION_MY
 * POSITIONS
 * RIOTCDNURI
 * CHAMPION
 * 
 ********************************************/

export const SUPPORT_LANGS: string[] = ['ko_KR', 'en_US'];
export const QUEUETYPE: { [key: number]: string } = {
    400: 'norm', //Normal Draft Pick
    420: 'solo',
    430: 'norm',
    440: 'flex',
    450: 'aram',
    700: 'clash',
    800: 'ai',  // Deprecated
    810: 'ai',  // Deprecated
    820: 'ai',  // Deprecated
    830: 'ai',
    840: 'ai',
    850: 'ai',
    900: 'urf',
    920: 'poro',
    1020: 'ofa',
    1300: 'nbg',
    1400: 'usb', // Ultimate Spellbook
    2000: 'tut',
    2010: 'tut',
    2020: 'tut',
};
export const PLATFORM_MY: { [key: string]: number } = {
    kr: 0,
    br1: 1,
    eun1: 2,
    euw1: 3,
    jp1: 4,
    la1: 5,
    la2: 6,
    na1: 7,
    oc1: 8,
    tr1: 9,
    ru: 10
};
export const PLATFORMS: string[] = ['kr', 'br1', 'eun1', 'euw1', 'jp1', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru'];
export const PLATFORM_NAME: { [key: string]: string} = {
    kr: 'KR',
    br1: 'BR',
    eun1: 'EUNE',
    euw1: 'EUW',
    jp1: 'JP',
    la1: 'LAN',
    la2: 'LAS',
    na1: 'NA',
    oc1: 'OCE',
    tr1: 'TR',
    ru: 'RU'
};
export const PLATFORM_ROUTING: { [key: string]: string } = {
    kr: 'asia',
    br1: 'americas',
    eun1: 'europe',
    euw1: 'europe',
    jp1: 'asia',
    la1: 'americas',
    la2: 'americas',
    na1: 'americas',
    oc1: 'americas',
    tr1: 'europe',
    ru: 'europe'
};
export const POSITION_MY: { [key: string]: number } = {
    NONE: 0,
    TOP: 1,
    MIDDLE: 2,
    JUNGLE: 3,
    BOTTOM: 4,
    UTILITY: 5,
    UNKNOWN: 6
};
export const POSITIONS: string[] = ['NONE', 'TOP', 'MIDDLE', 'JUNGLE', 'BOTTOM', 'UTILITY', 'UNKNOWN'];
export const RIOTCDNURI: string = 'https://ddragon.leagueoflegends.com/cdn/11.20.1';
