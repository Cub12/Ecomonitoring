const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/search/:name', (request,
                          response) => {
    const {name} = request.params;
    const db = dbService.getDBServiceInstance();
    const result = db.searchByName(name);

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.get('/getAllForTable1', (request, response) => {
    const db = dbService.getDBServiceInstance();
    const result = db.getAllDataForTable1();

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.get('/getAllForTable2', (request, response) => {
    const db = dbService.getDBServiceInstance();
    const result = db.getAllDataForTable2();

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.post('/insert_table1', (request,
                            response) => {
    const {name, head, address, economic_activity, form_of_ownership} = request.body;
    const db = dbService.getDBServiceInstance();
    const result = db.insertNewRowInTable1(name, head, address, economic_activity, form_of_ownership);

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.post('/insert_table2', (request, response) => {
    const {name, mass_flow_rate, permissible_emissions, danger_class} = request.body;
    const db = dbService.getDBServiceInstance();
    const result = db.insertNewRowInTable2(name, mass_flow_rate, permissible_emissions, danger_class);

    result.then(data => response.json({data: data})).catch(err => console.log(err));
});

app.patch('/update_table1', (request,
                             response) => {
    const {id, name, head, address, economic_activity, form_of_ownership} = request.body;
    const db = dbService.getDBServiceInstance();
    const result = db.updateRowInTable1(id, name, head, address, economic_activity, form_of_ownership);

    result.then(data => response.json({success: data})).catch(err => console.log(err));
});

app.patch('/update_table2', (request, response) => {
    const {id, name, mass_flow_rate, permissible_emissions, danger_class} = request.body;
    const db = dbService.getDBServiceInstance();
    const result = db.updateRowInTable2(id, name, mass_flow_rate, permissible_emissions, danger_class);

    result.then(data => response.json({success: data})).catch(err => console.log(err));
});

app.delete('/delete_table1/:id', (request,
                                  response) => {
    const {id} = request.params;
    const db = dbService.getDBServiceInstance();
    const result = db.deleteRowByIdTable1(id);

    result.then(data => response.json({success: data})).catch(err => console.log(err));
});

app.delete('/delete_table2/:id', (request, response) => {
    const {id} = request.params;
    const db = dbService.getDBServiceInstance();
    const result = db.deleteRowByIdTable2(id);

    result.then(data => response.json({success: data})).catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is running'));