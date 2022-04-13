CREATE TABLE category_member (
    categorylist_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(category_id) REFERENCES category(category_id)
);