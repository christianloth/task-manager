CREATE TABLE category (
    category_id INTEGER PRIMARY KEY,
    group_id INTEGER FOREIGN KEY REFERENCES groups(group_id),
    category_name TEXT NOT NULL,
    descriptions TEXT,
    create_date TEXT NOT NULL
);