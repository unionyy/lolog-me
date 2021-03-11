CREATE TABLE users (
    id_my           int         NOT NULL AUTO_INCREMENT,
    norm_name       varchar(50),
    platform_my     tinyint     NOT NULL,
    update_time     timestamp   NOT NULL,
    update_time_g   timestamp,
    explore_idx     int         NOT NULL,

    account_id      char(56)    NOT NULL,
    summoner_id     char(63)    NOT NULL,
    puuid           char(78)    NOT NULL,

    real_name       varchar(50) NOT NULL,
    profile_icon_id int         NOT NULL,
    summoner_level  int         NOT NULL,

    solo_tier       varchar(12) NOT NULL,
    solo_rank       varchar(5)  NOT NULL,
    solo_lp         int         NOT NULL,
    solo_wins       int         NOT NULL,
    solo_losses     int         NOT NULL,
    mini_prog       varchar(10),

    flex_tier       varchar(12) NOT NULL,
    flex_rank       varchar(5)  NOT NULL,
    flex_lp         int         NOT NULL,
    flex_wins       int         NOT NULL,
    flex_losses     int         NOT NULL,

    PRIMARY KEY (id_my),

    UNIQUE INDEX unique_puuid (puuid),

    UNIQUE INDEX platform_name (platform_my, norm_name)
);

CREATE TABLE games (
    id_my       int         NOT NULL,
    game_id     bigint      NOT NULL,
    play_time   timestamp   NOT NULL,
    platform_my tinyint     NOT NULL,
    champion    smallint    NOT NULL,
    queue_type  smallint    NOT NULL,
    lane_my     tinyint     NOT NULL,

    CONSTRAINT pk_my_time PRIMARY KEY (id_my, play_time DESC)
);

CREATE TABLE recent_games (
    game_id     bigint      NOT NULL,
    play_time   timestamp   NOT NULL,
    platform_my tinyint     NOT NULL,

    win0        tinyint     NOT NULL,
    kills0      smallint    NOT NULL,
    deaths0     smallint    NOT NULL,
    assists0    smallint    NOT NULL,
    gold0       int         NOT NULL,
    damage0     int         NOT NULL,

    win1        tinyint     NOT NULL,
    kills1      smallint    NOT NULL,
    deaths1     smallint    NOT NULL,
    assists1    smallint    NOT NULL,
    gold1       int         NOT NULL,
    damage1     int         NOT NULL,

    PRIMARY KEY (game_id)
);

CREATE TABLE participants (
    game_id     bigint      NOT NULL,
    part_id     tinyint     NOT NULL,

    team        tinyint     NOT NULL,

    champion    smallint    NOT NULL,
    spell1Id    tinyint     NOT NULL,
    spell2Id    tinyint     NOT NULL,

    champLevel  tinyint     NOT NULL,
    rune0       smallint    NOT NULL,
    rune1       smallint    NOT NULL,
    item0       smallint    NOT NULL,
    item1       smallint    NOT NULL,
    item2       smallint    NOT NULL,
    item3       smallint    NOT NULL,
    item4       smallint    NOT NULL,
    item5       smallint    NOT NULL,
    item6       smallint    NOT NULL,
    vision_score smallint   NOT NULL,      
    vision_buy  smallint    NOT NULL,      
    vision_place smallint   NOT NULL,      
    vision_kill smallint    NOT NULL,
    multikill   tinyint     NOT NULL,      
    kills       smallint    NOT NULL,
    deaths      smallint    NOT NULL,
    assists     smallint    NOT NULL,
    minions     smallint    NOT NULL,
    jungle      smallint    NOT NULL,
    gold        int         NOT NULL,
    damage      int         NOT NULL,
    damage_total int        NOT NULL,

    CONSTRAINT pk_game_part PRIMARY KEY (game_id, part_id DESC)
);
