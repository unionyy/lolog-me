export { RuneStyleDto, ChampionDto }

type RuneStyleDto = {
    id: number,
    icon: string,
    name: string,
    slots: SlotDto[]
}
type SlotDto = {
    runes: RuneDto[]
}
type RuneDto = {
    id: number,
    icon: string,
    name: string,
    longDesc: string
}

type ChampionDto = {
    data: { [key: string]: ChampionDataDto }
}
type ChampionDataDto = {
    id: string,
    key: string
}