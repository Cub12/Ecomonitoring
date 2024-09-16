document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAllForTable1').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table'));

    fetch('http://localhost:5000/getAllForTable2').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));
});

document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete_row_button") {
        deleteRowByIdTable1(event.target.dataset.id);
    }

    if (event.target.className === "edit_row_button") {
        handleEditRowTable1(event.target.dataset.id);
    }
});

document.querySelector('#table2 tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete_row_button") {
        deleteRowByIdTable2(event.target.dataset.id);
    }

    if (event.target.className === "edit_row_button") {
        handleEditRowTable2(event.target.dataset.id);
    }
});

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

const searchButton = document.querySelector('#search_button');

searchButton.onclick = function () {
    const searchValue = document.querySelector('#search_input').value;

    fetch('http://localhost:5000/search/' + searchValue).then(response => response.json()).then(data => loadHTMLTable(data['data'], 'table'));
};

const addButton = document.querySelector('#add_data_button');

addButton.onclick = function () {
    const name = document.querySelector('#name_input').value.trim();
    const head = document.querySelector('#head_input').value.trim();
    const address = document.querySelector('#address_input').value.trim();
    const economicActivity = document.querySelector('#economic_activity_input').value.trim();
    const formOfOwnership = document.querySelector('#form_of_ownership_input').value.trim();

    if (!name || !head || !address || !economicActivity || !formOfOwnership) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    fetch('http://localhost:5000/insert_table1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            head: head,
            address: address,
            economic_activity: economicActivity,
            form_of_ownership: formOfOwnership
        })
    }).then(response => response.json()).then(data => insertRowIntoTable1(data.data));
};

const addButton2 = document.querySelector('#add_data2_button');

addButton2.onclick = function () {
    const name = document.querySelector('#name2_input').value.trim();
    const massFlowRate = document.querySelector('#mass_flow_rate_input').value.trim();
    const permissibleEmissions = document.querySelector('#permissible_emissions_input').value.trim();
    const dangerClass = document.querySelector('#danger_class_input').value.trim();

    if (!name || !massFlowRate || !permissibleEmissions || !dangerClass) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    fetch('http://localhost:5000/insert_table2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            mass_flow_rate: massFlowRate,
            permissible_emissions: permissibleEmissions,
            danger_class: dangerClass
        })
    }).then(response => response.json()).then(data => insertRowIntoTable2(data.data));
};

function handleEditRowTable1(id) {
    const updateRow = document.querySelector('#update_row');
    updateRow.hidden = false;
    const row = document.querySelector(`tr[data-id="${id}"]`);

    document.querySelector('#update_name_input').dataset.id = id;
    document.querySelector('#update_name_input').value = row.querySelector('.name').textContent;
    document.querySelector('#update_head_input').value = row.querySelector('.head').textContent;
    document.querySelector('#update_address_input').value = row.querySelector('.address').textContent;
    document.querySelector('#update_economic_activity_input').value = row.querySelector('.economic_activity').textContent;
    document.querySelector('#update_form_of_ownership_input').value = row.querySelector('.form_of_ownership').textContent;
}

function handleEditRowTable2(id) {
    const updateRow2 = document.querySelector('#update_row2');
    updateRow2.hidden = false;

    const row = document.querySelector(`#table2 tr[data-id="${id}"]`);

    document.querySelector('#update_name2_input').dataset.id = id;
    document.querySelector('#update_name2_input').value = row.querySelector('.name').textContent;
    document.querySelector('#update_mass_flow_rate_input').value = row.querySelector('.mass_flow_rate').textContent;
    document.querySelector('#update_permissible_emissions_input').value = row.querySelector('.permissible_emissions').textContent;
    document.querySelector('#update_danger_class_input').value = row.querySelector('.danger_class').textContent;
}

const updateButton = document.querySelector('#update_row_button');

updateButton.onclick = function () {
    const id = document.querySelector('#update_name_input').dataset.id;
    const name = document.querySelector('#update_name_input').value;
    const head = document.querySelector('#update_head_input').value;
    const address = document.querySelector('#update_address_input').value;
    const economicActivity = document.querySelector('#update_economic_activity_input').value;
    const formOfOwnership = document.querySelector('#update_form_of_ownership_input').value;

    if (!name || !head || !address || !economicActivity || !formOfOwnership) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    fetch('http://localhost:5000/update_table1', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: name,
            head: head,
            address: address,
            economic_activity: economicActivity,
            form_of_ownership: formOfOwnership
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
};

const updateButton2 = document.querySelector('#update_row2_button');

updateButton2.onclick = function () {
    const id = document.querySelector('#update_name2_input').dataset.id;
    const name = document.querySelector('#update_name2_input').value;
    const massFlowRate = document.querySelector('#update_mass_flow_rate_input').value;
    const permissibleEmissions = document.querySelector('#update_permissible_emissions_input').value;
    const dangerClass = document.querySelector('#update_danger_class_input').value;

    if (!name || !massFlowRate || !permissibleEmissions || !dangerClass) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    fetch('http://localhost:5000/update_table2', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: name,
            mass_flow_rate: massFlowRate,
            permissible_emissions: permissibleEmissions,
            danger_class: dangerClass
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
};

function insertRowIntoTable1(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no_data');

    let tableHTML = "<tr>";

    tableHTML += `<td>${data.id}</td>`;
    tableHTML += `<td>${data.name}</td>`;
    tableHTML += `<td>${data.head}</td>`;
    tableHTML += `<td>${data.address}</td>`;
    tableHTML += `<td>${data.economic_activity}</td>`;
    tableHTML += `<td>${data.form_of_ownership}</td>`;
    tableHTML += `<td><button class="delete_row_button" data-id=${data.id}>Delete</button></td>`;
    tableHTML += `<td><button class="edit_row_button" data-id=${data.id}>Edit</button></td>`;
    tableHTML += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHTML;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

function insertRowIntoTable2(data) {
    const table = document.querySelector('#table2 tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${data.id}</td>
        <td class="name">${data.name}</td>
        <td class="mass_flow_rate">${data.mass_flow_rate}</td>
        <td class="permissible_emissions">${data.permissible_emissions}</td>
        <td class="danger_class">${data.danger_class}</td>
        <td><button class="delete_row_button" data-id="${data.id}">Delete</button></td>
        <td><button class="edit_row_button" data-id="${data.id}">Edit</button></td>
    `;

    table.appendChild(newRow);
}

function deleteRowByIdTable1(id) {
    fetch('http://localhost:5000/delete_table1/' + id, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function deleteRowByIdTable2(id) {
    fetch('http://localhost:5000/delete_table2/' + id, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
}