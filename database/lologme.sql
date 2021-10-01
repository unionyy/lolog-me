CREATE TABLE summoners (
    id_my           int         NOT NULL AUTO_INCREMENT,
    norm_name       varchar(50),
    platform_my     tinyint     NOT NULL,
    update_time     timestamp,

    account_id      char(56),
    summoner_id     char(63)    NOT NULL,
    puuid           char(78)    NOT NULL,

    summoner_name   varchar(50) NOT NULL,
    profile_icon_id int         NOT NULL,
    summoner_level  int         NOT NULL,

    solo_tier       varchar(12),
    solo_rank       varchar(5) ,
    solo_lp         int,
    solo_wins       int,
    solo_losses     int,
    solo_mini_prog  varchar(10),

    flex_tier       varchar(12),
    flex_rank       varchar(5),
    flex_lp         int,
    flex_wins       int,
    flex_losses     int,
    flex_mini_prog  varchar(10),


    PRIMARY KEY (id_my),

    UNIQUE INDEX unique_puuid (puuid),

    UNIQUE INDEX platform_name (platform_my, norm_name)
);

CREATE TABLE matches (
    match_id    bigint      UNSIGNED    NOT NULL,
    platform_my tinyint     UNSIGNED    NOT NULL,

    start_time  timestamp   NOT NULL,
    duration    smallint    UNSIGNED    NOT NULL,
    queue_id    smallint    UNSIGNED    NOT NULL,

    CONSTRAINT pk_id_platform PRIMARY KEY (match_id, platform_my DESC)
);

CREATE TABLE participants (
    id_my       int         UNSIGNED    NOT NULL,
    match_id    bigint      UNSIGNED    NOT NULL,

    win_my      tinyint     UNSIGNED    NOT NULL,
    total_kills smallint    UNSIGNED    NOT NULL,

    champ_id    smallint    UNSIGNED    NOT NULL,
    champ_level tinyint     UNSIGNED    NOT NULL,
    spell1_id   tinyint     UNSIGNED    NOT NULL,
    spell2_id   tinyint     UNSIGNED    NOT NULL,
    rune_main_id smallint   UNSIGNED    NOT NULL,
    rune_sub_style smallint UNSIGNED    NOT NULL,
    position    tinyint   UNSIGNED      NOT NULL,
    
    kills       tinyint     UNSIGNED    NOT NULL,
    deaths      tinyint     UNSIGNED    NOT NULL,
    assists     tinyint     UNSIGNED    NOT NULL,
    item0       smallint    UNSIGNED    NOT NULL,
    item1       smallint    UNSIGNED    NOT NULL,
    item2       smallint    UNSIGNED    NOT NULL,
    item3       smallint    UNSIGNED    NOT NULL,
    item4       smallint    UNSIGNED    NOT NULL,
    item5       smallint    UNSIGNED    NOT NULL,
    item6       smallint    UNSIGNED    NOT NULL,
    minion_killed smallint  UNSIGNED    NOT NULL,
    jungle_killed smallint  UNSIGNED    NOT NULL,
    gold_earned int         UNSIGNED    NOT NULL,
    damage_champ int        UNSIGNED    NOT NULL,
    damage_total int        UNSIGNED    NOT NULL,
    multi_kill  tinyint     UNSIGNED    NOT NULL,
    vision_score smallint   UNSIGNED    NOT NULL,
    wards_bought smallint   UNSIGNED    NOT NULL,
    wards_placed smallint   UNSIGNED    NOT NULL,
    wards_killed smallint   UNSIGNED    NOT NULL,
    wards_placed_detector smallint UNSIGNED NOT NULL,


    CONSTRAINT id_my_match PRIMARY KEY (id_my, match_id)
);
