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

    async getData(query) {
        try {
            const response = await new Promise((resolve, reject) => {
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

    async getAllDataForTable1() {
        const query = "SELECT * FROM objects;";
        return this.getData(query);
    }

    async getAllDataForTable2() {
        const query = "SELECT * FROM pollutants;";
        return this.getData(query);
    }

    async insertNewRow(table, values) {
        try {
            let query;
            let params;

            if (table === 'objects') {
                query = `INSERT INTO objects (name, head, address, economic_activity, form_of_ownership) 
                     VALUES (?, ?, ?, ?, ?);`;
                params = values;
            } else if (table === 'pollutants') {
                query = `INSERT INTO pollutants (name, mass_flow_rate, permissible_emissions, danger_class) 
                     VALUES (?, ?, ?, ?);`;
                params = values;
            } else {
                throw new Error('Invalid table name');
            }

            const insertId = await new Promise((resolve, reject) => {
                connection.query(query, params, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });

            if (table === 'objects') {
                return {
                    id: insertId,
                    name: values[0],
                    head: values[1],
                    address: values[2],
                    economic_activity: values[3],
                    form_of_ownership: values[4]
                };
            } else {
                return {
                    id: insertId,
                    name: values[0],
                    mass_flow_rate: values[1],
                    permissible_emissions: values[2],
                    danger_class: values[3]
                };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewRowInTable1(name, head, address, economic_activity, form_of_ownership) {
        return this.insertNewRow('objects', [name, head, address, economic_activity, form_of_ownership]);
    }

    async insertNewRowInTable2(name, mass_flow_rate, permissible_emissions, danger_class) {
        return this.insertNewRow('pollutants', [name, mass_flow_rate, permissible_emissions, danger_class]);
    }

    async updateRow(table, id, values) {
        try {
            id = parseInt(id, 10);

            let query;
            if (table === 'objects') {
                query = `UPDATE objects 
                     SET name = ?, head = ?, address = ?, economic_activity = ?, form_of_ownership = ? 
                     WHERE id = ?;`;
            } else if (table === 'pollutants') {
                query = `UPDATE pollutants 
                     SET name = ?, mass_flow_rate = ?, permissible_emissions = ?, danger_class = ? 
                     WHERE id = ?;`;
            } else {
                throw new Error('Invalid table name');
            }

            const response = await new Promise((resolve, reject) => {
                connection.query(query, [...values, id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            });

            return response === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateRowInTable1(id, name, head, address, economic_activity, form_of_ownership) {
        return this.updateRow('objects', id, [name, head, address, economic_activity, form_of_ownership]);
    }

    async updateRowInTable2(id, name, mass_flow_rate, permissible_emissions, danger_class) {
        return this.updateRow('pollutants', id, [name, mass_flow_rate, permissible_emissions, danger_class]);
    }

    async deleteRowById(table, id) {
        try {
            id = parseInt(id, 10);

            let query;
            if (table === 'objects') {
                query = "DELETE FROM objects WHERE id = ?;";
            } else if (table === 'pollutants') {
                query = "DELETE FROM pollutants WHERE id = ?;";
            } else {
                throw new Error('Invalid table name');
            }

            const response = await new Promise((resolve, reject) => {
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteRowByIdTable1(id) {
        return this.deleteRowById('objects', id);
    }

    async deleteRowByIdTable2(id) {
        return this.deleteRowById('pollutants', id);
    }
}

module.exports = DBService;