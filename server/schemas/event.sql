CREATE TABLE events (
    event_id INTEGER PRIMARY KEY,
    event_name TEXT NOT NULL,
    descriptions TEXT,
    user_id INTEGER,
    group_id INTEGER,
    event_date TEXT NOT NULL,
    event_location TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(group_id) REFERENCES groups(group_id)

);