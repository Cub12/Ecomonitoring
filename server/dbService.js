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
            'table2': ['name', 'mass_flow_rate', 'permissible_emissions', 'danger_class'],
            'table4': ['Objects_id', 'Pollutants_id', 'general_emissions', 'date']
        };

        if (!validColumns[table]) {
            throw new Error('Invalid table name');
        }

        if (!validColumns[table].includes(column)) {
            throw new Error(`Invalid column name for ${table}`);
        }

        try {
            const response = await new Promise((resolve, reject) => {
                const tableMapping = {
                    table1: 'objects',
                    table2: 'pollutants',
                    table4: 'calculations'
                };

                const selectedTable = tableMapping[table] || 'objects';
                const query = `SELECT * FROM ${selectedTable} WHERE ${column} LIKE ?;`;
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

    async sortTableGeneric(tableName, validColumns, numericColumns, column, sortOrder) {
        if (!validColumns.includes(column)) {
            throw new Error(`Invalid column name for ${tableName}`);
        }

        const orderBy = numericColumns.includes(column)
            ? `CASE WHEN ${column} = -1 THEN NULL ELSE ${column} END`
            : column;
        const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';

        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM ${tableName} ORDER BY ${orderBy} ${orderDirection};`;

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

    async sortTable2(column, sortOrder) {
        const validColumns = ['name', 'mass_flow_rate', 'permissible_emissions', 'danger_class'];
        const numericColumns = ['mass_flow_rate', 'permissible_emissions', 'danger_class'];

        return this.sortTableGeneric('pollutants', validColumns, numericColumns, column, sortOrder);
    }

    async sortTable4(column, sortOrder) {
        const validColumns = [
            'Objects_id', 'Pollutants_id', 'general_emissions', 'date'
        ];
        const numericColumns = [
            'general_emissions', 'date'
        ];

        return this.sortTableGeneric('calculations', validColumns, numericColumns, column, sortOrder);
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
        const query = `SELECT calculations.id, objects.name AS object_name, pollutants.name AS pollutant_name, 
            calculations.general_emissions, pollutants.mass_flow_rate, pollutants.permissible_emissions, 
            pollutants.danger_class, calculations.date 
            FROM calculations 
            JOIN objects ON calculations.Objects_id = objects.id 
            JOIN pollutants ON calculations.Pollutants_id = pollutants.id ORDER BY calculations.id;`;
        return this.getData(query);
    }

    async getAllDataForTable4() {
        const query = "SELECT * FROM calculations;";
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
            } else if (table === 'calculations') {
                query = `INSERT INTO calculations (Objects_id, Pollutants_id, general_emissions, date)
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
            } else if (table === 'pollutants') {
                return {
                    id: insertId,
                    name: values[0],
                    mass_flow_rate: values[1],
                    permissible_emissions: values[2],
                    danger_class: values[3]
                };
            } else if (table === 'calculations') {
                return {
                    id: insertId,
                    Objects_id: values[0],
                    Pollutants_id: values[1],
                    general_emissions: values[2],
                    date: values[3]
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

    async insertNewRowInTable4(Objects_id, Pollutants_id, general_emissions, date) {
        return this.insertNewRow('calculations', [Objects_id, Pollutants_id, general_emissions, date]);
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
            }  else if (table === 'calculations') {
                query = `UPDATE calculations
                     SET Objects_id = ?, Pollutants_id = ?, general_emissions = ?, date = ? 
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

    async updateRowInTable4(id, Objects_id, Pollutants_id, general_emissions, date) {
        return this.updateRow('calculations', id, [Objects_id, Pollutants_id, general_emissions, date]);
    }

    async deleteRowById(table, id) {
        try {
            id = parseInt(id, 10);

            let query;
            if (table === 'objects') {
                query = "DELETE FROM objects WHERE id = ?;";
            } else if (table === 'pollutants') {
                query = "DELETE FROM pollutants WHERE id = ?;";
            }  else if (table === 'calculations') {
                query = "DELETE FROM calculations WHERE id = ?;";
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

    async deleteRowByIdTable4(id) {
        return this.deleteRowById('calculations', id);
    }
}

module.exports = DBService;