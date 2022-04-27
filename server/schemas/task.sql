CREATE TABLE task (
	task_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    category_id INTEGER,
    task_name TEXT NOT NULL,
    descriptions TEXT,
    complete INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(category_id) REFERENCES category(category_id)
);