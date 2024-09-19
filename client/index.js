document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAll/table1').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table'));

    fetch('http://localhost:5000/getAll/table2').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));
});

document.querySelector('#table tbody').addEventListener('click', function (event) {
    handleTableClick(1, event);
});

document.querySelector('#table2 tbody').addEventListener('click', function (event) {
    handleTableClick(2, event);
});

const searchButton = document.querySelector('#search_button');
searchButton.onclick = function () {
    const searchValue = document.querySelector('#search_input').value;
    fetch('http://localhost:5000/search/' + searchValue).then(response => response.json()).then(data => loadHTMLTable(data['data'], 'table'));
};

const addButton1 = document.querySelector('#add_data_button');
addButton1.onclick = function () {
    handleAddButton(
        1,
        ['#name_input', '#head_input', '#address_input', '#economic_activity_input', '#form_of_ownership_input'],
        'http://localhost:5000/insert/table1',
        insertRowIntoTable1
    );
};

const addButton2 = document.querySelector('#add_data2_button');
addButton2.onclick = function () {
    handleAddButton(
        2,
        ['#name2_input', '#mass_flow_rate_input', '#permissible_emissions_input', '#danger_class_input'],
        'http://localhost:5000/insert/table2',
        insertRowIntoTable2
    );
};

const updateButton1 = document.querySelector('#update_row_button');
updateButton1.onclick = () => handleUpdate('table1');

const updateButton2 = document.querySelector('#update_row2_button');
updateButton2.onclick = () => handleUpdate('table2');

function loadHTMLTable(data, tableId) {
    const table = document.querySelector(`#${tableId} tbody`);

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no_data' colspan='6'>No data</td></tr>";
        return;
    }

    let tableHTML = "";
    data.forEach(function (row) {
        tableHTML += "<tr>";
        Object.keys(row).forEach(function (key) {
            tableHTML += `<td>${row[key]}</td>`;
        });
        tableHTML += `<td><button class="delete_row_button" data-id=${row.id}>Delete</button></td>`;
        tableHTML += `<td><button class="edit_row_button" data-id=${row.id}>Edit</button></td>`;
        tableHTML += "</tr>";
    });
    table.innerHTML = tableHTML;
}

function handleTableClick(tableId, event) {
    if (event.target.className === "delete_row_button") {
        deleteRowById(event.target.dataset.id, tableId);
    }

    if (event.target.className === "edit_row_button") {
        handleEditRow(event.target.dataset.id, tableId);
    }
}

function deleteRowById(id, tableId) {
    const table = tableId === 1 ? 'table1' : 'table2';
    const url = `http://localhost:5000/delete/${table}/${id}`;

    fetch(url, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    }).catch(err => console.log(err));
}

function handleEditRow(id, tableId) {
    const updateRow = document.querySelector(tableId === 1 ? '#update_row' : '#update_row2');
    updateRow.hidden = false;
    const row = document.querySelector(`table${tableId === 1 ? '' : '#table2'} tr[data-id="${id}"]`);

    const fields = {
        1: {
            idInput: '#update_name_input',
            fields: [
                {name: 'name', selector: '.name'},
                {name: 'head', selector: '.head'},
                {name: 'address', selector: '.address'},
                {name: 'economic_activity', selector: '.economic_activity'},
                {name: 'form_of_ownership', selector: '.form_of_ownership'}
            ]
        },
        2: {
            idInput: '#update_name2_input',
            fields: [
                {name: 'name', selector: '.name'},
                {name: 'mass_flow_rate', selector: '.mass_flow_rate'},
                {name: 'permissible_emissions', selector: '.permissible_emissions'},
                {name: 'danger_class', selector: '.danger_class'}
            ]
        }
    };

    const {idInput, fields: fieldDefinitions} = fields[tableId];
    document.querySelector(idInput).dataset.id = id;

    fieldDefinitions.forEach(field => {
        document.querySelector(`#${field.name}_input`).value = row.querySelector(field.selector).textContent;
    });
}

function handleAddButton(tableId, inputSelectors, endpoint, insertRowFunction) {
    const values = inputSelectors.map(selector => document.querySelector(selector).value.trim());

    if (values.some(value => !value)) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    const requestData = tableId === 1
        ? {
            name: values[0],
            head: values[1],
            address: values[2],
            economic_activity: values[3],
            form_of_ownership: values[4]
        }
        : {
            name: values[0],
            mass_flow_rate: values[1],
            permissible_emissions: values[2],
            danger_class: values[3]
        };

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }).then(response => response.json()).then(data => insertRowFunction(data.data));
}

function handleUpdate(tableId) {
    const fields = {
        table1: [
            {name: 'name', id: 'update_name_input'},
            {name: 'head', id: 'update_head_input'},
            {name: 'address', id: 'update_address_input'},
            {name: 'economic_activity', id: 'update_economic_activity_input'},
            {name: 'form_of_ownership', id: 'update_form_of_ownership_input'}
        ],
        table2: [
            {name: 'name', id: 'update_name2_input'},
            {name: 'mass_flow_rate', id: 'update_mass_flow_rate_input'},
            {name: 'permissible_emissions', id: 'update_permissible_emissions_input'},
            {name: 'danger_class', id: 'update_danger_class_input'}
        ]
    };

    const fieldDefinitions = fields[tableId];
    const id = document.querySelector(`#${fieldDefinitions[0].id}`).dataset.id;
    const formData = {};

    fieldDefinitions.forEach(field => {
        formData[field.name] = document.querySelector(`#${field.id}`).value.trim();
    });

    const emptyFields = Object.values(formData).some(value => !value);
    if (emptyFields) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    fetch(`http://localhost:5000/update/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            ...formData
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    }).catch(error => {
        console.error('Update error:', error);
    });
}

function insertRowIntoTable(tableSelector, data, columnMapping) {
    const table = document.querySelector(tableSelector + ' tbody');
    const isTableData = table.querySelector('.no_data');
    let tableHTML = "<tr>";

    columnMapping.forEach(column => {
        tableHTML += `<td class="${column}">${data[column]}</td>`;
    });

    tableHTML += `<td><button class="delete_row_button" data-id="${data.id}">Delete</button></td>`;
    tableHTML += `<td><button class="edit_row_button" data-id="${data.id}">Edit</button></td>`;
    tableHTML += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHTML;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

function insertRowIntoTable1(data) {
    insertRowIntoTable('table', data, ['id', 'name', 'head', 'address', 'economic_activity',
        'form_of_ownership']);
}

function insertRowIntoTable2(data) {
    insertRowIntoTable('#table2', data, ['id', 'name', 'mass_flow_rate', 'permissible_emissions',
        'danger_class']);
}