CREATE TABLE category_member (
    categorylist_id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY REFERENCES users(user_id),
    category_id INTEGER FOREIGN KEY REFERENCES category(category_id),
);