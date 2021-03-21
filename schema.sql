DROP DATABASE qaapidb;
CREATE DATABASE qaapidb;

\c qaapidb;

-- DROP ALL TABLES --
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos CASCADE;

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  username VARCHAR(50) DEFAULT 'guest',
  email VARCHAR(50) DEFAULT 'nobody@guest.com',
  reported BOOLEAN DEFAULT FALSE,
  helpfulness INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INT NOT NULL REFERENCES questions(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  username VARCHAR(50) DEFAULT 'guest',
  email VARCHAR(50) DEFAULT 'nobody@guest.com',
  reported BOOLEAN DEFAULT FALSE,
  helpfulness INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INT NOT NULL REFERENCES answers(id),
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(100) UNIQUE DEFAULT 'guest',
  email VARCHAR(50) UNIQUE DEFAULT 'guest@anon.com'
);

COPY questions FROM '/home/kuyavinny/coding/questions.csv' CSV HEADER;
COPY answers FROM '/home/kuyavinny/coding/answers.csv' CSV HEADER;
COPY photos FROM '/home/kuyavinny/coding/answers_photos.csv' CSV HEADER;

SELECT pg_catalog.setval(pg_get_serial_sequence('questions', 'id'), MAX(id)) FROM questions;
SELECT pg_catalog.setval(pg_get_serial_sequence('answers', 'id'), MAX(id)) FROM answers;
SELECT pg_catalog.setval(pg_get_serial_sequence('photos', 'id'), MAX(id)) FROM photos;


-- TIMING REPORTS BEFORE INDEXING AFTER A FRESH IMPORT

\timing

SELECT * FROM questions LIMIT 5;
SELECT * FROM answers LIMIT 5;
SELECT * FROM photos LIMIT 5;

\timing

-- INDEX OPTIMIZATIONS

CREATE INDEX questions_id ON questions (id);
CREATE INDEX questions_product_id ON questions (id, product_id);
CREATE INDEX answers_id ON answers (id);
CREATE INDEX answers_question_id ON answers (id, question_id);
CREATE INDEX photos_id ON photos (id);
CREATE INDEX photos_answer_id ON photos (id, answer_id);

-- TIMING REPORTS AFTER INDEXING AFTER A FRESH IMPORT
\timing

SELECT * FROM questions LIMIT 5;
SELECT * FROM answers LIMIT 5;
SELECT * FROM photos LIMIT 5;

\timing

CREATE INDEX questions_id ON questions (id);
CREATE INDEX answers_id ON answers (id);
CREATE INDEX answers_question_id ON answers (question_id);
CREATE INDEX photos_id ON photos (id);
CREATE INDEX photos_answer_id ON photos (answer_id);

SELECT * FROM questions LIMIT 5;
SELECT * FROM answers LIMIT 5;
SELECT * FROM photos LIMIT 5;

