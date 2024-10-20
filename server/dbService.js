const mysql = require("mysql");
const dotenv = require("dotenv");
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
    if (err) console.log(err.message);
});

class DBService {
    static getDBServiceInstance() {
        return instance ? instance : new DBService();
    }

    async searchByColumn(table, column, value) {
        const validColumns = {
            'table1': ['name', 'head', 'address', 'economic_activity', 'form_of_ownership'],
            'table2': ['name', 'permissible_emissions', 'danger_class', 'tax_rate_aw', 'tax_rate_p'],
            'table4': ['Objects_id', 'Pollutants_id', 'general_emissions', 'date', 'tax'],
            'table5': ['Objects_id', 'Pollutants_id', 'general_emissions', 'date', 'tax']
        };

        if (!validColumns[table]) throw new Error('Invalid table name');
        if (!validColumns[table].includes(column)) throw new Error(`Invalid column name for ${table}`);

        try {
            return await new Promise((resolve, reject) => {
                const tableMapping = {
                    table1: 'objects', table2: 'pollutants', table4: 'calculations_air',
                    table5: 'calculations_water'
                };
                const selectedTable = tableMapping[table] || 'objects';
                let query = '';

                if (selectedTable === 'objects' || selectedTable === 'pollutants') {
                    query = `SELECT * FROM ${selectedTable} WHERE ${column} LIKE ?;`;
                } else if (selectedTable === 'calculations_air') {
                    query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
                    c.date, p.tax_rate_aw, c.tax
                    FROM calculations_air c
                    JOIN objects o ON c.Objects_id = o.id
                    JOIN pollutants p ON c.Pollutants_id = p.id WHERE ${column} LIKE ?;`;
                } else if (selectedTable === 'calculations_water') {
                    query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
                    c.date, p.tax_rate_aw, c.tax
                    FROM calculations_water c
                    JOIN objects o ON c.Objects_id = o.id
                    JOIN pollutants p ON c.Pollutants_id = p.id WHERE ${column} LIKE ?;`;
                }

                const searchValue = `${value}%`;

                connection.query(query, [searchValue], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async sortTableGeneric(tableName, validColumns, numericColumns, column, sortOrder) {
        if (!validColumns.includes(column)) throw new Error(`Invalid column name for ${tableName}`);

        const orderBy = numericColumns.includes(column) ?
            `CASE WHEN ${column} = -1 THEN NULL ELSE ${column} END` : column;
        const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';

        try {
            return await new Promise((resolve, reject) => {
                let query = '';

                if (tableName === 'pollutants') {
                    query = `SELECT * FROM ${tableName} ORDER BY ${orderBy} ${orderDirection};`;
                } else if (tableName === 'calculations_air') {
                    query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
                    c.date, p.tax_rate_aw, c.tax
                    FROM calculations_air c
                    JOIN objects o ON c.Objects_id = o.id
                    JOIN pollutants p ON c.Pollutants_id = p.id ORDER BY ${orderBy} ${orderDirection};`;
                } else if (tableName === 'calculations_water') {
                    query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
                    c.date, p.tax_rate_aw, c.tax
                    FROM calculations_water c
                    JOIN objects o ON c.Objects_id = o.id
                    JOIN pollutants p ON c.Pollutants_id = p.id ORDER BY ${orderBy} ${orderDirection};`;
                }

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async sortTable2(column, sortOrder) {
        const validColumns = ['name', 'permissible_emissions', 'danger_class', 'tax_rate_aw', 'tax_rate_p'];
        const numericColumns = ['permissible_emissions', 'danger_class', 'tax_rate_aw', 'tax_rate_p'];

        return this.sortTableGeneric('pollutants', validColumns, numericColumns, column, sortOrder);
    }

    async sortTable4(column, sortOrder) {
        const validColumns = ['Objects_id', 'Pollutants_id', 'general_emissions', 'date', 'tax_rate_aw', 'tax'];
        const numericColumns = ['general_emissions', 'date', 'tax_rate_aw', 'tax'];

        return this.sortTableGeneric('calculations_air', validColumns, numericColumns, column, sortOrder);
    }

    async sortTable5(column, sortOrder) {
        const validColumns = ['Objects_id', 'Pollutants_id', 'general_emissions', 'date', 'tax'];
        const numericColumns = ['general_emissions', 'date', 'tax'];

        return this.sortTableGeneric('calculations_water', validColumns, numericColumns, column, sortOrder);
    }

    async getData(query) {
        try {
            return await new Promise((resolve, reject) => {
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
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
        const query = `SELECT o.name AS object_name, p.name AS pollutant_name, c.general_emissions, 
        p.permissible_emissions, p.danger_class, c.date, c.tax
        FROM calculations_air c
        JOIN objects o ON c.Objects_id = o.id 
        JOIN pollutants p ON c.Pollutants_id = p.id
        UNION ALL
        SELECT o.name AS object_name, p.name AS pollutant_name, c.general_emissions, p.permissible_emissions, 
        p.danger_class, c.date, c.tax
        FROM calculations_water c
        JOIN objects o ON c.Objects_id = o.id 
        JOIN pollutants p ON c.Pollutants_id = p.id;`;

        return this.getData(query);
    }

    async getAllDataForTable4() {
        const query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
        c.date, p.tax_rate_aw, c.tax
        FROM calculations_air c
        JOIN objects o ON c.Objects_id = o.id
        JOIN pollutants p ON c.Pollutants_id = p.id ORDER BY c.id;`;

        return this.getData(query);
    }

    async getAllDataForTable4_place() {
        const query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
        c.date, p.tax_rate_p, c.tax
        FROM calculations_air c
        JOIN objects o ON c.Objects_id = o.id
        JOIN pollutants p ON c.Pollutants_id = p.id ORDER BY c.id;`;

        return this.getData(query);
    }

    async getAllDataForTable5() {
        const query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
        c.date, p.tax_rate_aw, c.tax
        FROM calculations_water c
        JOIN objects o ON c.Objects_id = o.id
        JOIN pollutants p ON c.Pollutants_id = p.id ORDER BY c.id;`;

        return this.getData(query);
    }

    async getAllDataForTable5_place() {
        const query = `SELECT c.id, o.name AS Objects_name, p.name AS Pollutants_name, c.general_emissions, 
        c.date, p.tax_rate_p, c.tax
        FROM calculations_water c
        JOIN objects o ON c.Objects_id = o.id
        JOIN pollutants p ON c.Pollutants_id = p.id ORDER BY c.id;`;

        return this.getData(query);
    }

    async getAllDataForTable6() {
        const query = `SELECT r.id, o.name, r.Electricity, r.C1ns, r.C1v, r.C2ns, r.C2v, r.V1ns, r.V1v, r.V2ns, 
                r.V2v, r.Tax
        FROM radio_creation r
        JOIN objects o ON r.Objects_id = o.id ORDER BY r.id;`;

        return this.getData(query);
    }

    async getAllDataForTable7() {
        const query = `SELECT t.id, o.name, t.N, t.V, t.T, t.Tax
        FROM temp_place t
        JOIN objects o ON t.Objects_id = o.id ORDER BY t.id;`;

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
                query = `INSERT INTO pollutants (name, permissible_emissions, danger_class, tax_rate_aw, tax_rate_p) 
                VALUES (?, ?, ?, ?, ?);`;
                params = values;
            } else if (table === 'calculations_air') {
                query = `INSERT INTO calculations_air (Objects_id, Pollutants_id, general_emissions, date, tax)
                VALUES (?, ?, ?, ?, 0);`;
                params = values;
            } else if (table === 'calculations_water') {
                query = `INSERT INTO calculations_water (Objects_id, Pollutants_id, general_emissions, date, tax)
                VALUES (?, ?, ?, ?, 0);`;
                params = values;
            } else if (table === 'radio_creation') {
                query = `INSERT INTO radio_creation (Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns, V1v, V2ns, 
                V2v, Tax)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`;
                params = values;
            } else if (table === 'temp_place') {
                query = `INSERT INTO temp_place (Objects_id, N, V, T, Tax)
                VALUES (?, ?, ?, ?, 0);`;
                params = values;
            }

            const insertId = await new Promise((resolve, reject) => {
                connection.query(query, params, (err, result) => {
                    if (err) reject({message: 'Помилка при виконанні запиту', error: err.message});
                    resolve(result.insertId);
                });
            });

            if (table === 'objects') {
                return {
                    id: insertId, name: values[0], head: values[1], address: values[2], economic_activity: values[3],
                    form_of_ownership: values[4]
                };
            } else if (table === 'pollutants') {
                return {
                    id: insertId, name: values[0], permissible_emissions: values[1], danger_class: values[2],
                    tax_rate_aw: values[3], tax_rate_p: values[4]
                };
            } else if (table === 'calculations_air') {
                return {
                    id: insertId, Objects_id: values[0], Pollutants_id: values[1], general_emissions: values[2],
                    date: values[3]
                };
            } else if (table === 'calculations_water') {
                return {
                    id: insertId, Objects_id: values[0], Pollutants_id: values[1], general_emissions: values[2],
                    date: values[3]
                };
            } else if (table === 'radio_creation') {
                return {
                    id: insertId, Objects_id: values[0], Electricity: values[1], C1ns: values[2], C1v: values[3],
                    C2ns: values[4], C2v: values[5], V1ns: values[6], V1v: values[7], V2ns: values[8], V2v: values[9]
                };
            } else if (table === 'temp_place') {
                return {
                    id: insertId, Objects_id: values[0], N: values[1], V: values[2], T: values[3]
                };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewRowInTable1(name, head, address, economic_activity, form_of_ownership) {
        return this.insertNewRow('objects', [name, head, address, economic_activity, form_of_ownership]);
    }

    async insertNewRowInTable2(name, permissible_emissions, danger_class, tax_rate_aw, tax_rate_p) {
        return this.insertNewRow('pollutants', [name, permissible_emissions, danger_class, tax_rate_aw,
            tax_rate_p]);
    }

    async insertNewRowInTable4(Objects_id, Pollutants_id, general_emissions, date) {
        return this.insertNewRow('calculations_air', [Objects_id, Pollutants_id, general_emissions, date]);
    }

    async insertNewRowInTable5(Objects_id, Pollutants_id, general_emissions, date) {
        return this.insertNewRow('calculations_water', [Objects_id, Pollutants_id, general_emissions,
            date]);
    }

    async insertNewRowInTable6(Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns, V1v, V2ns, V2v) {
        return this.insertNewRow('radio_creation', [Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns,
            V1v, V2ns, V2v]);
    }

    async insertNewRowInTable7(Objects_id, N, V, T) {
        return this.insertNewRow('temp_place', [Objects_id, N, V, T]);
    }

    async updateRow(table, id, values) {
        try {
            id = parseInt(id, 10);
            let query;

            if (table === 'objects') {
                query = `UPDATE objects SET name = ?, head = ?, address = ?, economic_activity = ?, 
                form_of_ownership = ? 
                WHERE id = ?;`;
            } else if (table === 'pollutants') {
                query = `UPDATE pollutants SET name = ?, permissible_emissions = ?, danger_class = ?, tax_rate_aw = ?, 
                tax_rate_p = ? WHERE id = ?;`;
            } else if (table === 'calculations_air') {
                query = `UPDATE calculations_air SET Objects_id = ?, Pollutants_id = ?, general_emissions = ?, date = ? 
                WHERE id = ?;`;
            } else if (table === 'calculations_water') {
                query = `UPDATE calculations_water SET Objects_id = ?, Pollutants_id = ?, general_emissions = ?, 
                date = ?
                WHERE id = ?;`;
            } else if (table === 'radio_creation') {
                query = `UPDATE radio_creation SET Objects_id = ?, Electricity = ?, C1ns = ?, C1v = ?, C2ns = ?, 
                C2v = ?, V1ns = ?, V1v = ?, V2ns = ?, V2v = ?
                WHERE id = ?;`;
            } else if (table === 'temp_place') {
                query = `UPDATE temp_place SET Objects_id = ?, N = ?, V = ?, T = ?
                WHERE id = ?;`;
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

    async updateRowInTable2(id, name, permissible_emissions, danger_class, tax_rate_aw, tax_rate_p) {
        return this.updateRow('pollutants', id, [name, permissible_emissions, danger_class, tax_rate_aw,
            tax_rate_p]);
    }

    async updateRowInTable4(id, Objects_id, Pollutants_id, general_emissions, date) {
        return this.updateRow('calculations_air', id, [Objects_id, Pollutants_id, general_emissions, date]);
    }

    async updateRowInTable5(id, Objects_id, Pollutants_id, general_emissions, date) {
        return this.updateRow('calculations_water', id, [Objects_id, Pollutants_id, general_emissions,
            date]);
    }

    async updateRowInTable6(id, Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns, V1v, V2ns, V2v) {
        return this.updateRow('radio_creation', id, [Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns,
            V1v, V2ns, V2v]);
    }

    async updateRowInTable7(id, Objects_id, N, V, T) {
        return this.updateRow('temp_place', id, [Objects_id, N, V, T]);
    }

    async deleteRowById(table, id) {
        try {
            id = parseInt(id, 10);
            let query;

            if (table === 'objects') {
                query = "DELETE FROM objects WHERE id = ?;";
            } else if (table === 'pollutants') {
                query = "DELETE FROM pollutants WHERE id = ?;";
            } else if (table === 'calculations_air') {
                query = "DELETE FROM calculations_air WHERE id = ?;";
            } else if (table === 'calculations_water') {
                query = "DELETE FROM calculations_water WHERE id = ?;";
            } else if (table === 'radio_creation') {
                query = "DELETE FROM radio_creation WHERE id = ?;";
            } else if (table === 'temp_place') {
                query = "DELETE FROM temp_place WHERE id = ?;";
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
        return this.deleteRowById('calculations_air', id);
    }

    async deleteRowByIdTable5(id) {
        return this.deleteRowById('calculations_water', id);
    }

    async deleteRowByIdTable6(id) {
        return this.deleteRowById('radio_creation', id);
    }

    async deleteRowByIdTable7(id) {
        return this.deleteRowById('temp_place', id);
    }

    async calculateTax(table, type_tax_button, coef1, coef2) {
        if (type_tax_button === 'calculate_air_button') {
            const query = `UPDATE calculations_air c JOIN pollutants p ON c.Pollutants_id = p.id 
            SET c.tax = ROUND(c.general_emissions * p.tax_rate_aw, 2);`;

            try {
                await this.getData(query);
                return await this.getAllDataForTable4();
            } catch (error) {
                console.error('Error updating tax in calculations:', error);
                throw error;
            }
        } else if (type_tax_button === 'calculate_water_button') {
            const query = `UPDATE calculations_water c JOIN pollutants p ON c.Pollutants_id = p.id 
            SET c.tax = ROUND(c.general_emissions * p.tax_rate_aw * ${coef1}, 2);`;

            try {
                await this.getData(query);
                return await this.getAllDataForTable5();
            } catch (error) {
                console.error('Error updating tax in calculations:', error);
                throw error;
            }
        } else if (table === 'table4' && type_tax_button === 'calculate_place_button') {
            const query = `UPDATE calculations_air c JOIN pollutants p ON c.Pollutants_id = p.id 
            SET c.tax = ROUND(c.general_emissions * p.tax_rate_p * ${coef1} * ${coef2}, 2);`;

            try {
                await this.getData(query);
                return await this.getAllDataForTable4_place();
            } catch (error) {
                console.error('Error updating tax in calculations:', error);
                throw error;
            }
        } else if (table === 'table5' && type_tax_button === 'calculate_place_button') {
            const query = `UPDATE calculations_water c JOIN pollutants p ON c.Pollutants_id = p.id 
            SET c.tax = ROUND(c.general_emissions * p.tax_rate_p * ${coef1} * ${coef2}, 2);`;

            try {
                await this.getData(query);
                return await this.getAllDataForTable5_place();
            } catch (error) {
                console.error('Error updating tax in calculations:', error);
                throw error;
            }
        } else if (type_tax_button === 'calculate_radio_creation_button') {
            const query = `UPDATE radio_creation SET Tax = ROUND(Electricity * 0.0133 + (2 * C1ns * V1ns + 50 * 
            C1v * V1v) + ${coef1} * ${coef2} * (2 * C2ns * V2ns + 50 * C2v * V2v), 2);`;

            try {
                await this.getData(query);
                return await this.getAllDataForTable6();
            } catch (error) {
                console.error('Error updating tax in calculations:', error);
                throw error;
            }
        } else if (type_tax_button === 'calculate_temp_place_button') {
            const query = `UPDATE temp_place SET Tax = ROUND(N * V * T, 2);`;

            try {
                await this.getData(query);
                return await this.getAllDataForTable7();
            } catch (error) {
                console.error('Error updating tax in calculations:', error);
                throw error;
            }
        }
    }
}

module.exports = DBService;