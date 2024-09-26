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

    async searchByColumn(table, column, value) {
        const validColumns = {
            'table1': ['name', 'head', 'address', 'economic_activity', 'form_of_ownership'],
            'table2': ['name', 'mass_flow_rate', 'permissible_emissions', 'danger_class']
        };

        if (!validColumns[table]) {
            throw new Error('Invalid table name');
        }

        if (!validColumns[table].includes(column)) {
            throw new Error(`Invalid column name for ${table}`);
        }

        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM ${table === 'table1' ? 'objects' : 'pollutants'} WHERE ${column} LIKE ?;`;
                const searchValue = `${value}%`;

                connection.query(query, [searchValue], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async sortTable(column, sortOrder) {
        const validColumns = ['name', 'mass_flow_rate', 'permissible_emissions', 'danger_class'];
        const numericColumns = ['mass_flow_rate', 'permissible_emissions', 'danger_class'];

        if (!validColumns.includes(column)) {
            throw new Error('Invalid column name for table2');
        }

        const orderBy = numericColumns.includes(column) ? `CASE WHEN ${column} = -1 THEN NULL ELSE ${column} 
        END` : column;
        const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';

        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM pollutants ORDER BY ${orderBy} ${orderDirection};`;

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

    async getAllDataForTable3() {
        const query = "SELECT calculations.id,\n" +
            "    objects.name AS object_name,\n" +
            "    pollutants.name AS pollutant_name,\n" +
            "    calculations.general_emissions,\n" +
            "    pollutants.mass_flow_rate,\n" +
            "    pollutants.permissible_emissions,\n" +
            "    pollutants.danger_class,\n" +
            "    calculations.date\n" +
            "FROM \n" +
            "    calculations\n" +
            "JOIN \n" +
            "    objects ON calculations.Objects_id = objects.id\n" +
            "JOIN \n" +
            "    pollutants ON calculations.Pollutants_id = pollutants.id ORDER BY calculations.id;\n";
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