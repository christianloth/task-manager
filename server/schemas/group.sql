CREATE TABLE groups (
    group_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    group_name TEXT NOT NULL,
    descriptions TEXT,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);