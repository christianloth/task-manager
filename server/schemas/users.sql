CREATE TABLE users (
	user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
    pass_word TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
);