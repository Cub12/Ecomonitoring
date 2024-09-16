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

    async getAllDataForTable1() {
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

    async getAllDataForTable2() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM pollutants;";

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

    async insertNewRowInTable1(name, head, address, economic_activity, form_of_ownership) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = `INSERT INTO objects (name, head, address, economic_activity, form_of_ownership) 
                VALUES (?, ?, ?, ?, ?);`;

                connection.query(query, [name, head, address, economic_activity, form_of_ownership],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId);
                    });
            });

            return {
                id: insertId,
                name: name,
                head: head,
                address: address,
                economic_activity: economic_activity,
                form_of_ownership: form_of_ownership
            };
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewRowInTable2(name, mass_flow_rate, permissible_emissions, danger_class) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = `INSERT INTO pollutants (name, mass_flow_rate, permissible_emissions, danger_class) 
                           VALUES (?, ?, ?, ?);`;

                connection.query(query, [name, mass_flow_rate, permissible_emissions, danger_class],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId);
                    });
            });

            return {
                id: insertId,
                name: name,
                mass_flow_rate: mass_flow_rate,
                permissible_emissions: permissible_emissions,
                danger_class: danger_class
            };
        } catch (error) {
            console.log(error);
        }
    }

    async updateRowInTable1(id, name, head, address, economic_activity, form_of_ownership) {
        try {
            id = parseInt(id, 10);

            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE objects 
                           SET name = ?, head = ?, address = ?, economic_activity = ?, form_of_ownership = ? 
                           WHERE id = ?;`;

                connection.query(query, [name, head, address, economic_activity, form_of_ownership, id],
                    (err, result) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            resolve(result.affectedRows);
                        }
                    });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateRowInTable2(id, name, mass_flow_rate, permissible_emissions, danger_class) {
        try {
            id = parseInt(id, 10);

            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE pollutants 
                           SET name = ?, mass_flow_rate = ?, permissible_emissions = ?, danger_class = ? 
                           WHERE id = ?;`;

                connection.query(query, [name, mass_flow_rate, permissible_emissions, danger_class, id],
                    (err, result) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            resolve(result.affectedRows);
                        }
                    });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteRowByIdTable1(id) {
        try {
            id = parseInt(id, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM objects WHERE id = ?;";

                connection.query(query, [id], (err, result) => {
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

    async deleteRowByIdTable2(id) {
        try {
            id = parseInt(id, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM pollutants WHERE id = ?;";

                connection.query(query, [id], (err, result) => {
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
}

module.exports = DBService;