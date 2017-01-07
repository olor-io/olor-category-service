DROP DATABASE IF EXISTS categories;
CREATE DATABASE categories;

\c categories;

CREATE TABLE category (
  ID INTEGER PRIMARY KEY,
  href VARCHAR
);

INSERT INTO category (ID, href)
  VALUES (0, 'MDAw.pdf'),
         (1, 'MDAx.pdf'),
         (2, 'MDAy.pdf'),
         (3, 'MDAz.pdf'),
         (4, 'MDA0.pdf'),
         (5, 'MDA1.pdf'),
         (6, 'MDA2.pdf'),
         (7, 'MDA3.pdf'),
         (8, 'MDA4.pdf'),
         (9, 'MDA5.pdf'),
         (10, 'MDEw.pdf'),
         (11, 'MDEx.pdf'),
         (12, 'MDEy.pdf'),
         (13, 'MDEz.pdf'),
         (14, 'MDE0.pdf'),
         (15, 'MDE1.pdf'),
         (16, 'MDE2.pdf'),
         (17, 'MDE3.pdf'),
         (18, 'MDE4.pdf'),
         (19, 'MDE5.pdf');
