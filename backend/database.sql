CREATE DATABASE cached_votes;

\c cached_votes;

CREATE TABLE votes(
    voteId SERIAL PRIMARY KEY,
    voteData VARCHAR(300),
    voteStatus VARCHAR(30),
    processed BOOLEAN NOT NULL
);