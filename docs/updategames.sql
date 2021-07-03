ALTER TABLE games ADD win_my tinyint default -1;
ALTER TABLE games ADD kills smallint default -1;
ALTER TABLE games ADD deaths smallint default -1;
ALTER TABLE games ADD assists smallint default -1;
ALTER TABLE games ADD total_kills smallint default -1;

ALTER TABLE games ADD duration smallint default -1;
ALTER TABLE games ADD cs smallint default -1;
ALTER TABLE games ADD multi_kill tinyint default -1;
ALTER TABLE games ADD vision_score smallint default -1;


ALTER TABLE games DROP win_my;
ALTER TABLE games DROP kills;
ALTER TABLE games DROP deaths;
ALTER TABLE games DROP assists;
ALTER TABLE games DROP total_kills;

ALTER TABLE games DROP duration;
ALTER TABLE games DROP cs;
ALTER TABLE games DROP multi_kill;
ALTER TABLE games DROP vision_score;

TRUNCATE participants;

ALTER TABLE participants ADD best_player tinyint UNSIGNED NOT NULL default 0;