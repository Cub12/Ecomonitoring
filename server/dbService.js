const mysql = require("mysql");
const dotenv = require("dotenv");
const dbService = require("./dbService");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
});

class DBService {
    static getDBServiceInstance() {
        return instance ? instance : new DBService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM objects;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO objects (name) VALUES (?);";

                connection.query(query, [name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });

            return {
                id_Object: insertId,
                name: name
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id_Object) {
        try {
            id_Object = parseInt(id_Object, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM objects WHERE id_Object = ?;";

                connection.query(query, [id_Object], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id_Object, name) {
        try {
            id_Object = parseInt(id_Object, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE objects SET name = ? WHERE id_Object = ?;";

                connection.query(query, [name, id_Object], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM objects WHERE name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DBService;