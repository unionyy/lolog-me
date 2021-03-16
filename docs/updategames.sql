ALTER TABLE games ADD win_my tinyint default -1;
ALTER TABLE games ADD kills smallint default -1;
ALTER TABLE games ADD deaths smallint default -1;
ALTER TABLE games ADD assists smallint default -1;
ALTER TABLE games ADD total_kills smallint default -1;

ALTER TABLE games ADD duration smallint default -1;
ALTER TABLE games ADD cs smallint default -1;
ALTER TABLE games ADD multi_kill tinyint default -1;
ALTER TABLE games ADD vision_score smallint default -1;
