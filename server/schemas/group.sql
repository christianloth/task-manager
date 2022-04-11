CREATE TABLE groups (
    group_id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY REFERENCES users(user_id)
    group_name TEXT NOT NULL,
    descriptions TEXT,
);