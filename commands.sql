CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0 
);

INSERT INTO blogs (author, url, title) VALUES ('Joku Vaan', 'https://joku.fi', 'Mielikuvitukseton otsikko');

INSERT INTO blogs (author, url, title) VALUES ('Hullun Hauska', 'https://hullu.fi', 'Hauska otsikko');