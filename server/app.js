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
    const {table, column, value} = request.params;
    const db = dbService.getDBServiceInstance();
    const result = db.searchByColumn(table, column, value);

    result.then(data => response.json({data: data})).catch(err => console.log(err));
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
        case 'table3':
            result = db.getAllDataForTable3();
            break;
        case 'table4':
            result = db.getAllDataForTable4();
            break;
        case 'table5':
            result = db.getAllDataForTable5();
            break;
        case 'table6':
            result = db.getAllDataForTable6();
            break;
        case 'table7':
            result = db.getAllDataForTable7();
            break;
        default:
            return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.get('/getAll/:table/:calculationType', (request, response) => {
    const { table, calculationType } = request.params;
    const db = dbService.getDBServiceInstance();
    let result;

    switch (table) {
        case 'table4':
            if (calculationType === 'placement') {
                result = db.getAllDataForTable4_place();
            } else {
                result = db.getAllDataForTable4();
            }
            break;
        case 'table5':
            if (calculationType === 'placement') {
                result = db.getAllDataForTable5_place();
            } else {
                result = db.getAllDataForTable5();
            }
            break;
        default:
            return response.status(400).send('Invalid table');
    }

    result.then(data => response.json({ data: data })).catch(err => {
            console.error('Error retrieving data:', err);
            response.status(500).send('Error retrieving data');
        });
});

app.get('/sort/:table/:column/:sortOrder', (request, response) => {
    const {table, column, sortOrder} = request.params;
    const db = dbService.getDBServiceInstance();
    let result;

    if (table === 'table2') {
        result = db.sortTable2(column, sortOrder);
    } else if (table === 'table4') {
        result = db.sortTable4(column, sortOrder);
    } else if (table === 'table5') {
        result = db.sortTable5(column, sortOrder);
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
        const {name, permissible_emissions, danger_class, tax_rate_aw, tax_rate_p} = request.body;
        result = db.insertNewRowInTable2(name, permissible_emissions, danger_class, tax_rate_aw, tax_rate_p);
    } else if (table === 'table4') {
        const {Objects_id, Pollutants_id, general_emissions, date} = request.body;
        result = db.insertNewRowInTable4(Objects_id, Pollutants_id, general_emissions, date);
    } else if (table === 'table5') {
        const {Objects_id, Pollutants_id, general_emissions, date} = request.body;
        result = db.insertNewRowInTable5(Objects_id, Pollutants_id, general_emissions, date);
    } else if (table === 'table6') {
        const {Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns, V1v, V2ns, V2v} = request.body;
        result = db.insertNewRowInTable6(Objects_id, Electricity, C1ns, C1v, C2ns, C2v, V1ns, V1v, V2ns, V2v);
    } else if (table === 'table7') {
        const {Objects_id, N, V, T} = request.body;
        result = db.insertNewRowInTable7(Objects_id, N, V, T);
    } else {
        return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.patch('/update/:table', (request, response) => {
    const {table} = request.params;
    const {id, ...data} = request.body;
    const db = dbService.getDBServiceInstance();

    let result;
    switch (table) {
        case 'table1':
            result = db.updateRowInTable1(id, data.name, data.head, data.address, data.economic_activity,
                data.form_of_ownership);
            break;
        case 'table2':
            result = db.updateRowInTable2(id, data.name, data.permissible_emissions, data.danger_class,
                data.tax_rate_aw, data.tax_rate_p);
            break;
        case 'table4':
            result = db.updateRowInTable4(id, data.Objects_id, data.Pollutants_id, data.general_emissions, data.date);
            break;
        case 'table5':
            result = db.updateRowInTable5(id, data.Objects_id, data.Pollutants_id, data.general_emissions, data.date);
            break;
        case 'table6':
            result = db.updateRowInTable6(id, data.Objects_id, data.Electricity, data.C1ns, data.C1v, data.C2ns,
                data.C2v, data.V1ns, data.V1v, data.V2ns, data.V2v);
            break;
        case 'table7':
            result = db.updateRowInTable7(id, data.Objects_id, data.N, data.V, data.T);
            break;
        default:
            return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({success: data})).catch(err => {
        console.error(err);
        response.status(500).json({error: 'Internal server error'});
    });
});

app.post('/calculateTax', async (req, res) => {
    const {table, type_tax_button, coef1, coef2} = req.body;
    const db = dbService.getDBServiceInstance();

    try {
        let result;
        result = await db.calculateTax(table, type_tax_button, coef1, coef2);
        res.json({success: true, data: result});
    } catch (error) {
        console.error('Error in calculateTax route:', error);
        res.status(500).json({message: 'Error calculating tax'});
    }
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
        case 'table4':
            result = db.deleteRowByIdTable4(id);
            break;
        case 'table5':
            result = db.deleteRowByIdTable5(id);
            break;
        case 'table6':
            result = db.deleteRowByIdTable6(id);
            break;
        case 'table7':
            result = db.deleteRowByIdTable7(id);
            break;
        default:
            return response.status(400).json({error: 'Invalid table name'});
    }

    result.then(data => response.json({success: data})).catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is running'));