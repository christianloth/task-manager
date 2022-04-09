CREATE TABLE task (
	task_id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN key REFERENCES users(user_id),
    group_id INTEGER FOREIGN key REFERENCES groups(group_id),
    category_id INTEGER FOREIGN KEY REFERENCES category(category_id),
    task_name TEXT NOT NULL,
    descriptions TEXT,
);