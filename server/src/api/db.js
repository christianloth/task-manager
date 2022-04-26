const sqlite3 = require("sqlite3");
const { dirname } = require("path");
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
    }
}

module.exports = new MainDB(appDir + "/src/db/test2.db");
