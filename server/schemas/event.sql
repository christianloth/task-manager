CREATE TABLE events (
    event_id INTEGER PRIMARY KEY,
    event_name TEXT NOT NULL,
    descriptions TEXT,
    user_id INTEGER FOREIGN KEY REFERENCES users(user_id),
    event_date TEXT NOT NULL,
    event_time TEXT NOT NULL,
    event_location TEXT NOT NULL,
    group_id INTEGER FOREIGN KEY REFERENCES groups(group_id)
);