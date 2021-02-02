CREATE TABLE kr_users (
    id_my           int         NOT NULL AUTO_INCREMENT,
    norm_name       varchar(50) NOT NULL,
    updatetime      timestamp   NOT NULL,
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

    flex_tier       varchar(12) NOT NULL,
    flex_rank       varchar(5)  NOT NULL,
    flex_lp         int         NOT NULL,
    flex_wins       int         NOT NULL,
    flex_losses     int         NOT NULL

    PRIMARY KEY (normname)
);

CREATE TABLE kr_games (
    id_my       int         NOT NULL,
    game_id     bigint      NOT NULL,
    play_time   timestamp   NOT NULL,
    platform_my tinyint     NOT NULL,
    champion    smallint    NOT NULL,
    queue_type  smallint    NOT NULL,
    lane_my     tinyint     NOT NULL,

    PRIMARY KEY (game_id),
    INDEX idx_id_my (id_my)
    CONSTRAINT pk_my_game PRIMARY KEY (id_my,game_id)
);