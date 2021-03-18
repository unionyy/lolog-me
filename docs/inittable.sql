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

CREATE TABLE participants (
    id_my       int         UNSIGNED    NOT NULL,
    game_id     bigint      UNSIGNED    NOT NULL,

    duration    smallint    UNSIGNED    NOT NULL,
    win_my      tinyint     UNSIGNED    NOT NULL,
    total_kills smallint    UNSIGNED    NOT NULL,

    spell1      tinyint     UNSIGNED    NOT NULL,
    spell2      tinyint     UNSIGNED    NOT NULL,

    champ_level tinyint     UNSIGNED    NOT NULL,
    rune0       smallint    UNSIGNED    NOT NULL,
    rune1       smallint    UNSIGNED    NOT NULL,
    item0       smallint    UNSIGNED    NOT NULL,
    item1       smallint    UNSIGNED    NOT NULL,
    item2       smallint    UNSIGNED    NOT NULL,
    item3       smallint    UNSIGNED    NOT NULL,
    item4       smallint    UNSIGNED    NOT NULL,
    item5       smallint    UNSIGNED    NOT NULL,
    item6       smallint    UNSIGNED    NOT NULL,
    kills       tinyint     UNSIGNED    NOT NULL,
    deaths      tinyint     UNSIGNED    NOT NULL,
    assists     tinyint     UNSIGNED    NOT NULL,
    minions     smallint    UNSIGNED    NOT NULL,
    jungle      smallint    UNSIGNED    NOT NULL,
    gold        int         UNSIGNED    NOT NULL,
    multi_kill  tinyint     UNSIGNED    NOT NULL,
    vision_score smallint   UNSIGNED    NOT NULL,
    wards_bought smallint   UNSIGNED    NOT NULL,
    wards_placed smallint   UNSIGNED    NOT NULL,
    wards_killed smallint   UNSIGNED    NOT NULL,

    CONSTRAINT id_my_game PRIMARY KEY (id_my, game_id DESC)
);
