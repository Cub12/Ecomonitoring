document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAll/table1').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table'));

    fetch('http://localhost:5000/getAll/table2').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));

    fetch('http://localhost:5000/getAll/table3').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table3'));
});

document.querySelector('#table tbody').addEventListener('click', function (event) {
    handleTableClick(1, event);
});

document.querySelector('#table2 tbody').addEventListener('click', function (event) {
    handleTableClick(2, event);
});

document.querySelector('#table3 tbody').addEventListener('click', function (event) {
    handleTableClick(3, event);
});

const searchButton1 = document.querySelector('#search_button');
searchButton1.onclick = function () {
    const searchValue = document.querySelector('#search_input').value;
    const searchColumn = document.querySelector('#search_column').value;
    fetch(`http://localhost:5000/search/table1/${searchColumn}/${searchValue}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table'));
};

const searchButton2 = document.querySelector('#search_button2');
searchButton2.onclick = function () {
    const searchValue = document.querySelector('#search_input2').value;
    const searchColumn = document.querySelector('#search_column2').value;
    fetch(`http://localhost:5000/search/table2/${searchColumn}/${searchValue}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));
};

const searchButton3 = document.querySelector('#search_button3');
searchButton3.onclick = function () {
    const searchValue = document.querySelector('#search_input3').value;
    const searchColumn = document.querySelector('#search_column3').value;
    fetch(`http://localhost:5000/search/table3/${searchColumn}/${searchValue}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table3'));
};

const resetButton1 = document.querySelector('#reset_button');
resetButton1.addEventListener('click', function () {
    document.querySelector('#search_input').value = '';
});
resetButton1.onclick = function () {
    fetch(`http://localhost:5000/getAll/table1`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table`));
};

const resetButton2 = document.querySelector('#reset_button2');
resetButton2.addEventListener('click', function () {
    document.querySelector('#search_input2').value = '';
});
resetButton2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table2`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table2`));
};

const resetButton3 = document.querySelector('#reset_button3');
resetButton3.addEventListener('click', function () {
    document.querySelector('#search_input2').value = '';
});
resetButton3.onclick = function () {
    fetch(`http://localhost:5000/getAll/table2`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table2`));
};

const resetButton4 = document.querySelector('#reset_button4');
resetButton4.addEventListener('click', function () {
    document.querySelector('#search_input3').value = '';
});
resetButton4.onclick = function () {
    fetch(`http://localhost:5000/getAll/table3`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table3`));
};

const resetButton5 = document.querySelector('#reset_button5');
resetButton5.addEventListener('click', function () {
    document.querySelector('#search_input3').value = '';
});
resetButton5.onclick = function () {
    fetch(`http://localhost:5000/getAll/table3`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table3`));
};

function handleSort(tableId, sortColumn, sortOrder) {
    fetch(`http://localhost:5000/sort/table${tableId}/${sortColumn}/${sortOrder}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table${tableId}`));
}

const sortButton = document.querySelector('#sort_button');
sortButton.onclick = function () {
    const sortColumn = document.querySelector('#sort_column').value;
    const sortOrder = document.querySelector('#sort_order').value;
    handleSort(2, sortColumn, sortOrder);
};

const sortButton2 = document.querySelector('#sort_button2');
sortButton2.onclick = function () {
    const sortColumn = document.querySelector('#sort_column2').value;
    const sortOrder = document.querySelector('#sort_order2').value;
    handleSort(2, sortColumn, sortOrder);
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

const addButton3 = document.querySelector('#add_data3_button');
addButton3.onclick = function () {
    handleAddButton(
        3,
        ['#name3_input', '#name4_input', '#general_emissions_input', '#mass_flow_rate_input2',
            '#permissible_emissions_input2', '#danger_class_input2', '#date_input'],
        'http://localhost:5000/insert/table3',
        insertRowIntoTable3
    );
};

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
            let value = row[key];
            if (typeof value === 'number' && value === -1) {
                value = '-';
            }

            tableHTML += `<td>${value}</td>`;
        });

        if (tableId !== 'table3') {
            tableHTML += `<td class="button"><button class="edit_row_button" data-id=${row.id}>Редагувати</button>
            <button class="delete_row_button" data-id=${row.id}>Видалити</button></td>`;
            tableHTML += "</tr>";
        }
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
    let table = '';
    if (tableId === 1) {
        table = 'table1';
    } else if (tableId === 2) {
        table = 'table2';
    } else {
        table = 'table3';
    }

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
    const row = document.querySelector(`table${tableId === 1 ? '' : tableId === 2 ? '#table2' : '#table3'} 
        tr[data-id="${id}"]`);

    const fields = {
        1: {
            idInput: '#name_input',
            fields: [
                {name: 'name', selector: '.name'},
                {name: 'head', selector: '.head'},
                {name: 'address', selector: '.address'},
                {name: 'economic_activity', selector: '.economic_activity'},
                {name: 'form_of_ownership', selector: '.form_of_ownership'}
            ]
        },
        2: {
            idInput: '#name2_input',
            fields: [
                {name: 'name', selector: '.name'},
                {name: 'mass_flow_rate', selector: '.mass_flow_rate'},
                {name: 'permissible_emissions', selector: '.permissible_emissions'},
                {name: 'danger_class', selector: '.danger_class'}
            ]
        },
        3: {
            idInput: '#name3_input',
            fields: [
                {name: 'name4', selector: '.name4'},
                {name: 'general_emissions', selector: '.general_emissions'},
                {name: 'mass_flow_rate2', selector: '.mass_flow_rate2'},
                {name: 'permissible_emissions2', selector: '.permissible_emissions2'},
                {name: 'danger_class2', selector: '.danger_class2'},
                {name: 'date_input', selector: '.date_input'}
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

    const requestData = tableId === 1
        ? {
            name: values[0],
            head: values[1],
            address: values[2],
            economic_activity: values[3],
            form_of_ownership: values[4]
        }
        : tableId === 2
            ? {
                name: values[0],
                mass_flow_rate: values[1],
                permissible_emissions: values[2],
                danger_class: values[3]
            }
            : {
                objects_name: values[0],
                pollutants_name: values[1],
                calculations_general_emissions: values[2],
                pollutants_mass_flow_rate: values[3],
                pollutants_permissible_emissions: values[4],
                pollutants_danger_class: values[5],
                calculations_date: values[6]
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
            {name: 'name', id: 'name_input'},
            {name: 'head', id: 'head_input'},
            {name: 'address', id: 'address_input'},
            {name: 'economic_activity', id: 'economic_activity_input'},
            {name: 'form_of_ownership', id: 'form_of_ownership_input'}
        ],
        table2: [
            {name: 'name', id: 'name2_input'},
            {name: 'mass_flow_rate', id: 'mass_flow_rate_input'},
            {name: 'permissible_emissions', id: 'permissible_emissions_input'},
            {name: 'danger_class', id: 'danger_class_input'}
        ],
        table3: [
            {name: 'objects_name', id: 'name3_input'},
            {name: 'pollutants_name', id: 'name4_input'},
            {name: 'calculations_general_emissions', id: 'general_emissions_input'},
            {name: 'pollutants_mass_flow_rate', id: 'mass_flow_rate2_input'},
            {name: 'pollutants_permissible_emissions', id: 'permissible_emissions2_input'},
            {name: 'pollutants_danger_class', id: 'danger_class2_input'},
            {name: 'calculations_date', id: 'date_input'}
        ]
    };

    const fieldDefinitions = fields[tableId];
    const id = document.querySelector(`#${fieldDefinitions[0].id}`).dataset.id;
    const formData = {};

    fieldDefinitions.forEach(field => {
        formData[field.name] = document.querySelector(`#${field.id}`).value.trim();
    });

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

    if (tableSelector !== '#table3') {
    tableHTML += `<td class="button"><button class="edit_row_button" data-id=${data.id}>Редагувати</button>
            <button class="delete_row_button" data-id=${data.id}>Видалити</button></td>`;
    tableHTML += "</tr>";
    }

    if (isTableData) {
        table.innerHTML = tableHTML;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

function insertRowIntoTable1(data) {
    insertRowIntoTable('#table', data, ['id', 'name', 'head', 'address', 'economic_activity',
        'form_of_ownership']);
}

function insertRowIntoTable2(data) {
    insertRowIntoTable('#table2', data, ['id', 'name', 'mass_flow_rate', 'permissible_emissions',
        'danger_class']);
}

function insertRowIntoTable3(data) {
    insertRowIntoTable('#table3', data, ['id', 'objects_name', 'pollutants_name',
        'calculations_general_emissions', 'pollutants_mass_flow_rate', 'pollutants_permissible_emissions',
        'pollutants_danger_class', 'calculations_date']);
}

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth'});
        }
    });
});

function changeForm(id, newText) {
    const formText = document.querySelector(id);
    formText.textContent = newText;
}

const showFormButton = document.querySelector('#show_form_button');
showFormButton.onclick = function () {
    const formContainer = document.querySelector('#form_container');

    changeForm('#form_title', 'Додати нове підприємство');
    changeForm('#add_data_button', 'Додати нове підприємство');
    document.querySelector('#add-enterprise-form').reset();
    formContainer.classList.toggle('hidden');
};

const showFormButton2 = document.querySelector('#show_form_button2');
showFormButton2.onclick = function () {
    const formContainer = document.querySelector('#form_container2');

    changeForm('#form_title2', 'Додати нову речовину');
    changeForm('#add_data2_button', 'Додати нову речовину');
    document.querySelector('#add-substance-form').reset();
    formContainer.classList.toggle('hidden');
};

const showFormButton3 = document.querySelector('#show_form_button3');
showFormButton3.onclick = function () {
    const formContainer = document.querySelector('#form_container3');

    changeForm('#form_title3', 'Додати нове забруднення');
    changeForm('#add_data3_button', 'Додати нове забруднення');
    document.querySelector('#add-calculation-form').reset();
    formContainer.classList.toggle('hidden');
};

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit_row_button')) {
        changeForm('#form_title', 'Редагувати дані підприємства');
        changeForm('#add_data_button', 'Зберегти зміни');
        const button = document.querySelector('#add_data_button');
        button.id = 'update_row_button';

        const updateButton = document.querySelector('#update_row_button');
        updateButton.onclick = () => handleUpdate('table1');
        document.querySelector('#form_container').classList.toggle('hidden');


        changeForm('#form_title2', 'Редагувати дані речовини');
        changeForm('#add_data2_button', 'Зберегти зміни');
        const button2 = document.querySelector('#add_data2_button');
        button2.id = 'update_row2_button';

        const updateButton2 = document.querySelector('#update_row2_button');
        updateButton2.onclick = () => handleUpdate('table2');
        document.querySelector('#form_container2').classList.toggle('hidden');

        changeForm('#form_title3', 'Редагувати дані забруднення');
        changeForm('#add_data3_button', 'Зберегти зміни');
        const button3 = document.querySelector('#add_data3_button');
        button3.id = 'update_row3_button';

        const updateButton3 = document.querySelector('#update_row3_button');
        updateButton3.onclick = () => handleUpdate('table3');
        document.querySelector('#form_container3').classList.toggle('hidden');
    }
});