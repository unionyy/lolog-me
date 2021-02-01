CREATE TABLE users (
    normname varchar(50) NOT NULL,
    updatetime timestamp NOT NULL,
    profilehtml text NOT NULL,
    PRIMARY KEY (normname)
);

CREATE TABLE dates (
    normname varchar(50) NOT NULL,
    playdate varchar(20) NOT NULL,
    total tinyint NOT NULL,
    solo tinyint NOT NULL,
    flex tinyint NOT NULL,
    norm tinyint NOT NULL,
    aram tinyint NOT NULL,
    urf tinyint NOT NULL,
    ai tinyint NOT NULL,
    CONSTRAINT pk_name_date PRIMARY KEY (normname,playdate)
);

CREATE TABLE games (
    game_id int(10) NOT NULL AUTO_INCREMENT,
    normname varchar(50) NOT NULL,
    playdate varchar(20) NOT NULL,
    champ varchar(20) NOT NULL,
    gametype varchar(10) NOT NULL,
    yourgg_game_id bigint NOT NULL,
    PRIMARY KEY (game_id),
    INDEX idx_normname (normname)
);