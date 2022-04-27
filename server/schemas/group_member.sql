CREATE TABLE group_member_list (
    group_member_list_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    group_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(group_id) REFERENCES groups(group_id)
);