const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/search/:table/:column/:value', (request, response) => {
    const { table, column, value } = request.params;
    const db = dbService.getDBServiceInstance();
    const result = db.searchByColumn(table, column, value);

    result.then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/getAll/:table', (request, response) => {
    const {table} = request.params;
    const db = dbService.getDBServiceInstance();
    let result;

    switch (table) {
        case 'table1':
            result = db.getAllDataForTable1();
            break;
        case 'table2':
            result = db.getAllDataForTable2();
            break;
        default:
            return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.get('/sort/:table/:column/:sortOrder', (request, response) => {
    const {table, column, sortOrder} = request.params;
    const db = dbService.getDBServiceInstance();
    let result;

    if (table === 'table2') {
        result = db.sortTable2(column, sortOrder);
    } else {
        return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.post('/insert/:table', (request, response) => {
    const {table} = request.params;
    const db = dbService.getDBServiceInstance();
    let result;

    if (table === 'table1') {
        const {name, head, address, economic_activity, form_of_ownership} = request.body;
        result = db.insertNewRowInTable1(name, head, address, economic_activity, form_of_ownership);
    } else if (table === 'table2') {
        const {name, mass_flow_rate, permissible_emissions, danger_class} = request.body;
        result = db.insertNewRowInTable2(name, mass_flow_rate, permissible_emissions, danger_class);
    } else {
        return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.patch('/update/:table', (request, response) => {
    const { table } = request.params;
    const { id, ...data } = request.body;
    const db = dbService.getDBServiceInstance();

    let result;
    switch (table) {
        case 'table1':
            result = db.updateRowInTable1(
                id,
                data.name,
                data.head,
                data.address,
                data.economic_activity,
                data.form_of_ownership
            );
            break;
        case 'table2':
            result = db.updateRowInTable2(
                id,
                data.name,
                data.mass_flow_rate,
                data.permissible_emissions,
                data.danger_class
            );
            break;
        default:
            return response.status(400).json({ error: 'Invalid table name' });
    }

    result
        .then(data => response.json({ success: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: 'Internal server error' });
        });
});

app.delete('/delete/:table/:id', (request, response) => {
    const {table, id} = request.params;
    const db = dbService.getDBServiceInstance();
    let result;

    switch (table) {
        case 'table1':
            result = db.deleteRowByIdTable1(id);
            break;
        case 'table2':
            result = db.deleteRowByIdTable2(id);
            break;
        default:
            return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({success: data})).catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is running'));