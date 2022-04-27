const Faker = require("@faker-js/faker");
const faker = Faker.faker;
const sqlite3 = require("sqlite3");
const { dirname, resolve } = require("path");
const fs = require("fs");
const appDir = dirname(require.main.filename);

class MainDB {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.error("Could not connect to database", err);
            } else {
                console.log("Connected to database");
            }
        });

        this.db.query = function (sql, params) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.all(sql, params, function (error, rows) {
                    if (error) reject(error);
                    else resolve({ rows: rows });
                });
            });
        };
    }

    /* 
    Initialize DB with created schema files.
    Read each file from /schemas directory

    Created by: Reo Matsuda
    */

    initDB() {
        let dataSql;
        const db = this.db;

        return new Promise(async (resolve, reject) => {
            let files;
            try {
                files = fs.readdirSync(appDir + "/schemas");
            } catch (e) {
                reject(e);
            }
            for (const file of files) {
                // Do whatever you want to do with the file
                dataSql = fs
                    .readFileSync(appDir + "/schemas/" + file)
                    .toString();

                try {
                    const res = await db.query(dataSql);
                    console.log(res);
                } catch (e) {
                    console.error(e);
                }
            }

            resolve("GOOD");
        });
    }

    /* 
    Seed DB with fake data.
    Use FakerJS to create fake data.

    Created by: Reo Matsuda
    */

    async seedDB() {
        const MAX_USERS = 300;
        const MAX_GROUPS = 100;

        console.log("Seeding Users...");
        await this.db.query("DELETE FROM users;");
        for (let i = 0; i < MAX_USERS; ++i) {
            const username = faker.internet.userName();
            const first_name = faker.name.firstName();
            const last_name = faker.name.lastName();
            const pass_word = faker.internet.password();
            const email = faker.internet.email(first_name, last_name);
            try {
                await this.db.query(
                    `INSERT INTO users (user_id, username, first_name, last_name, pass_word, email) values (${i}, "${username}", "${first_name}", "${last_name}", "${pass_word}", "${email}")`
                );
            } catch (e) {
                console.log(e);
            }
        }

        console.log("Seeding Groups, Categories, Tasks...");
        await this.db.query("DELETE FROM groups;");
        await this.db.query("DELETE FROM group_member_list;");
        await this.db.query("DELETE FROM category;");
        await this.db.query("DELETE FROM task;");
        await this.db.query("DELETE FROM events;");
        await this.db.query("DELETE FROM admins;");
        // Store max ids to we can keep incrementing to get unique ids
        let max_group_member_list_id = 0;
        let max_category_id = 0;
        let max_task_id = 0;
        let max_admin_id = 0;
        let max_event_id = 0;
        // Create group
        for (let i = 0; i < MAX_GROUPS; ++i) {
            const user_id = Math.floor(Math.random() * (MAX_USERS - 1)) + 1;
            const group_name = faker.random.words(
                Math.floor((Math.random() + 1) * 4)
            );
            const descriptions = faker.random.words(30);
            const icon = "";

            let group_users = [];

            try {
                await this.db.query(
                    `INSERT INTO groups (group_id, user_id, group_name, descriptions, icon) values (${i}, "${user_id}", "${group_name}", "${descriptions}", "${icon}")`
                );

                // Add members to each group
                const maxMembers = Math.floor((Math.random() + 10) * 20);
                for (let j = 0; j < maxMembers; ++j) {
                    const rand_id =
                        Math.floor(Math.random() * (MAX_USERS - 1)) + 1;
                    group_users.push(rand_id);
                    await this.db.query(
                        `INSERT INTO group_member_list (group_member_list_id, user_id, group_id) values (${max_group_member_list_id++}, "${rand_id}", ${i})`
                    );
                }

                // Set admin to first 2 members
                await this.db.query(
                    `INSERT INTO admins (admin_id, user_id, group_id) values (${max_admin_id++}, "${
                        group_users[0]
                    }", ${i})`
                );
                await this.db.query(
                    `INSERT INTO admins (admin_id, user_id, group_id) values (${max_admin_id++}, "${
                        group_users[1]
                    }", ${i})`
                );

                // Create categories for each group
                const maxCategories = Math.floor((Math.random() + 1) * 10);
                for (let j = 0; j < maxCategories; ++j) {
                    const category_name = faker.random.words(
                        Math.floor((Math.random() + 1) * 4)
                    );
                    const category_description = faker.random.words(30);
                    await this.db.query(
                        `INSERT INTO category (category_id, group_id, category_name, descriptions, create_date) values (${max_category_id++}, ${i}, "${category_name}", "${category_description}", "${new Date().toISOString()}")`
                    );

                    // Create tasks for each category
                    for (let k = 0; k < 10; ++k) {
                        const user_id =
                            group_users[
                                Math.floor(Math.random() * group_users.length)
                            ];
                        const task_name = faker.random.words(
                            Math.floor((Math.random() + 1) * 4)
                        );
                        const task_description = faker.random.words(30);

                        await this.db.query(
                            `INSERT INTO task (task_id, user_id, category_id, task_name, descriptions, complete) values (${max_task_id++}, ${user_id}, ${
                                max_category_id - 1
                            }, "${task_name}", "${task_description}", 0);`
                        );
                    }
                }

                // Create events for each group
                const maxEvents = Math.floor(Math.random() * 3) + 1;
                // console.log(maxEvents);
                for (let j = 0; j < maxEvents; ++j) {
                    const event_name = faker.random.words(4);
                    const event_descriptions = faker.random.words(20);
                    const user_id =
                        group_users[
                            Math.floor(Math.random() * group_users.length)
                        ];
                    const group_id = i;
                    const event_date = new Date().toISOString();
                    const event_location = faker.address.streetAddress(true);
                    const res = await this.db.query(
                        `INSERT INTO events (event_id, event_name, descriptions, user_id, group_id, event_date, event_location) values (${max_event_id++}, "${event_name}", "${event_descriptions}", ${user_id}, ${group_id}, "${event_date}", "${event_location}");`
                    );
                    console.log(res);
                }
            } catch (e) {
                console.log(e);
            }
        }

        console.log("Done Seeding");
    }
}

module.exports = new MainDB(appDir + "/src/db/test.db");
