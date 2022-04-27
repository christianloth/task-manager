SELECT users.username
FROM users INNER JOIN group_member_list ON (group_member_list.user_id = users.user_id AND group_member_list.group_id = 96)
ORDER BY users.user_id;