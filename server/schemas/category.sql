CREATE TABLE category (
    category_id INTEGER PRIMARY KEY,
    group_id INTEGER,
    category_name TEXT NOT NULL,
    descriptions TEXT,
    create_date TEXT NOT NULL,
    FOREIGN KEY(group_id) REFERENCES groups(group_id)
);