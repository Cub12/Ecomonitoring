document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAll/table1').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table1'));

    fetch('http://localhost:5000/getAll/table2').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));

    fetch('http://localhost:5000/getAll/table3').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table3'));

    fetch('http://localhost:5000/getAll/table4').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table4'));
});

document.querySelector('#table1 tbody').addEventListener('click', function (event) {
    handleTableClick(1, event);
});

document.querySelector('#table2 tbody').addEventListener('click', function (event) {
    handleTableClick(2, event);
});

document.querySelector('#table3 tbody').addEventListener('click', function (event) {
    handleTableClick(3, event);
});

document.querySelector('#table4 tbody').addEventListener('click', function (event) {
    handleTableClick(4, event);
});

const searchButton1 = document.querySelector('#search_button1');
searchButton1.onclick = function () {
    const searchValue = document.querySelector('#search_input1').value;
    const searchColumn = document.querySelector('#search_column1').value;
    fetch(`http://localhost:5000/search/table1/${searchColumn}/${searchValue}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table1'));
};

const searchButton2 = document.querySelector('#search_button2');
searchButton2.onclick = function () {
    const searchValue = document.querySelector('#search_input2').value;
    const searchColumn = document.querySelector('#search_column2').value;
    fetch(`http://localhost:5000/search/table2/${searchColumn}/${searchValue}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));
};

const searchButton4 = document.querySelector('#search_button4');
searchButton4.onclick = function () {
    const searchValue = document.querySelector('#search_input4').value;
    const searchColumn = document.querySelector('#search_column4').value;
    fetch(`http://localhost:5000/search/table4/${searchColumn}/${searchValue}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table4'));
};

const resetButton1 = document.querySelector('#reset_button1');
resetButton1.addEventListener('click', function () {
    document.querySelector('#search_input1').value = '';
});
resetButton1.onclick = function () {
    fetch(`http://localhost:5000/getAll/table1`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table1`));
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

const resetButton2_2 = document.querySelector('#reset_button2_2');
resetButton2_2.addEventListener('click', function () {
    document.querySelector('#search_input2').value = '';
});
resetButton2_2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table2`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table2`));
};

const resetButton4 = document.querySelector('#reset_button4');
resetButton4.addEventListener('click', function () {
    document.querySelector('#search_input4').value = '';
});
resetButton4.onclick = function () {
    fetch(`http://localhost:5000/getAll/table4`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table4`));
};

const resetButton4_2 = document.querySelector('#reset_button4_2');
resetButton4_2.addEventListener('click', function () {
    document.querySelector('#search_input4').value = '';
});
resetButton4_2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table4`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table4`));
};

function handleSort(tableId, sortColumn, sortOrder) {
    fetch(`http://localhost:5000/sort/table${tableId}/${sortColumn}/${sortOrder}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table${tableId}`));
}

const sortButton2 = document.querySelector('#sort_button2');
sortButton2.onclick = function () {
    const sortColumn = document.querySelector('#sort_column2').value;
    const sortOrder = document.querySelector('#sort_order2').value;
    handleSort(2, sortColumn, sortOrder);
};

const sortButton4 = document.querySelector('#sort_button4');
sortButton4.onclick = function () {
    const sortColumn = document.querySelector('#sort_column4').value;
    const sortOrder = document.querySelector('#sort_order4').value;
    handleSort(4, sortColumn, sortOrder);
};

const addButton1 = document.querySelector('#add_data1_button');
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

const addButton4 = document.querySelector('#add_data4_button');
addButton4.onclick = async function () {
    handleAddButton(
        4,
        ['#Objects_id_input', '#Pollutants_id_input', '#general_emissions_input', '#date_input'],
        'http://localhost:5000/insert/table4',
        insertRowIntoTable4
    );
};

function loadHTMLTable(data, tableId) {
    const table = document.querySelector(`#${tableId} tbody`);

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
    } else if (tableId === 4) {
        table = 'table4';
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
    const row = document.querySelector(`table${tableId === 1 ? '' : tableId === 2 ? '#table2' : '#table4'} 
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
        4: {
            idInput: '#Objects_id_input',
            fields: [
                {name: 'Pollutants_id', selector: '.Pollutants_id'},
                {name: 'general_emissions', selector: '.general_emissions'},
                {name: 'date', selector: '.date'}
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
        : tableId === 2 ? {
            name: values[0],
            mass_flow_rate: values[1],
            permissible_emissions: values[2],
            danger_class: values[3]
        } : tableId === 4 ? {
            Objects_id: values[0],
            Pollutants_id: values[1],
            general_emissions: values[2],
            date: values[3]
        } : {}

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }).then(response => response.json()).catch(error => {
        alert(`        Не існує підприємства або речовини з такою ID,
        перевірте введені значення та, якщо потрібно,
        спочатку додайте нове підприємство або речовину у
        відповідні таблиці`);
        throw error;
    }).then(data => insertRowFunction(data.data));
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
        table4: [
            {name: 'Objects_id', id: 'Objects_id_input'},
            {name: 'Pollutants_id', id: 'Pollutants_id_input'},
            {name: 'general_emissions', id: 'general_emissions_input'},
            {name: 'date', id: 'date_input'}
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
    insertRowIntoTable('#table1', data, ['id', 'name', 'head', 'address', 'economic_activity',
        'form_of_ownership']);
}

function insertRowIntoTable2(data) {
    insertRowIntoTable('#table2', data, ['id', 'name', 'mass_flow_rate', 'permissible_emissions',
        'danger_class']);
}

function insertRowIntoTable4(data) {
    insertRowIntoTable('#table4', data, ['id', 'Objects_id', 'Pollutants_id', 'general_emissions',
        'date']);
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

const showFormButton1 = document.querySelector('#show_form_button1');
showFormButton1.onclick = function () {
    const formContainer = document.querySelector('#form_container1');

    changeForm('#form_title1', 'Додати нове підприємство');
    changeForm('#add_data1_button', 'Додати нове підприємство');
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

const showFormButton4 = document.querySelector('#show_form_button4');
showFormButton4.onclick = async function () {
    const formContainer = document.querySelector('#form_container4');

    changeForm('#form_title4', 'Додати нове забруднення');
    changeForm('#add_data4_button', 'Додати нове забруднення');
    document.querySelector('#add-pollutions-form').reset();
    formContainer.classList.toggle('hidden');
};

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit_row_button')) {
        changeForm('#form_title1', 'Редагувати дані підприємства');
        changeForm('#add_data1_button', 'Зберегти зміни');
        const button = document.querySelector('#add_data1_button');
        button.id = 'update_row1_button';

        const updateButton1 = document.querySelector('#update_row1_button');
        updateButton1.onclick = () => handleUpdate('table1');
        document.querySelector('#form_container1').classList.toggle('hidden');


        changeForm('#form_title2', 'Редагувати дані речовини');
        changeForm('#add_data2_button', 'Зберегти зміни');
        const button2 = document.querySelector('#add_data2_button');
        button2.id = 'update_row2_button';

        const updateButton2 = document.querySelector('#update_row2_button');
        updateButton2.onclick = () => handleUpdate('table2');
        document.querySelector('#form_container2').classList.toggle('hidden');

        changeForm('#form_title4', 'Редагувати дані забруднення');
        changeForm('#add_data4_button', 'Зберегти зміни');
        const button4 = document.querySelector('#add_data4_button');
        button4.id = 'update_row4_button';

        const updateButton4 = document.querySelector('#update_row4_button');
        updateButton4.onclick = () => handleUpdate('table4');
        document.querySelector('#form_container4').classList.toggle('hidden');
    }
});