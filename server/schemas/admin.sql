CREATE TABLE admins(
    admin_id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY REFERENCES users(user_id),
    group_id INTEGER FOREIGN KEY REFERENCES groups(group_id),
);