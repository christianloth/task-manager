SELECT users.first_name, users.user_id, group_member.group_id 
FROM users INNER JOIN group_member ON group_member.user_id = users.user_id;