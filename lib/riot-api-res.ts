export { SummonerDTO, LeagueEntryDTO, MatchDto }

type SummonerDTO = {
    accountId: string,
    profileIconId: number,
    revisionDate: number,
    name: string,
    id: string,
    puuid: String,
    summonerLevel: number
}
type LeagueEntryDTO = {
    queueType: string,
    tier: string,
    rank: string,
    leaguePoints: number,
    wins: number,
    losses: number,
    miniSeries?: MiniSeriesDTO
}
type MiniSeriesDTO = {
    progress: string
}
type MatchDto = {
    info: InfoDto
}
type InfoDto = {
    gameEndTimestamp: number,
    gameDuration: number,
    gameStartTimestamp: number,
    queueId: number,
    participants: ParticipantDto[]
    teams: TeamDto[]
}
type ParticipantDto = {
    puuid: string,
    teamId: number,
    summonerId: string,
    summonerName: string,
    summonerLevel: number,
    profileIcon: number,
    championId: number,
    champLevel: number,
    summoner1Id: number,
    summoner2Id: number,
    perks?: PerksDto,
    teamPosition: string,
    kills: number,
    deaths: number,
    assists: number,
    item0: number,
    item1: number,
    item2: number,
    item3: number,
    item4: number,
    item5: number,
    item6: number,
    totalMinionsKilled: number,
    neutralMinionsKilled: number,
    goldEarned: number,
    totalDamageDealtToChampions: number,
    totalDamageDealt: number,
    largestMultiKill: number,
    visionScore: number,
    visionWardsBoughtIngame: number,
    wardsPlaced: number,
    wardsKilled: number,
    detectorWardsPlaced: number
}
type PerksDto = {
    styles: PerkStyleDto[]
}
type PerkStyleDto = {
    selections: PerkStyleSelectionDto[],
    style: number
}
type PerkStyleSelectionDto = {
    perk: number
}
type TeamDto = {
    teamId: number,
    win: boolean
}