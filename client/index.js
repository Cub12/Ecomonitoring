document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAll/table1').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table1'));

    fetch('http://localhost:5000/getAll/table2').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table2'));

    fetch('http://localhost:5000/getAll/table3').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table3'));

    fetch('http://localhost:5000/getAll/table4').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table4'));

    fetch('http://localhost:5000/getAll/table5').then(response => response.json())
        .then(data => loadHTMLTable(data['data'], 'table5'));
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

document.querySelector('#table5 tbody').addEventListener('click', function (event) {
    handleTableClick(5, event);
});

const searchButton1 = document.querySelector('#search_button1');
searchButton1.onclick = function () {
    const searchValue = document.querySelector('#search_input1').value;
    const searchColumn = document.querySelector('#search_column1').value;
    fetch(`http://localhost:5000/search/table1/${searchColumn}/${searchValue}`)
        .then(response => response.json()).then(data => loadHTMLTable(data['data'], 'table1'));
};

const searchButton2 = document.querySelector('#search_button2');
searchButton2.onclick = function () {
    const searchValue = document.querySelector('#search_input2').value;
    const searchColumn = document.querySelector('#search_column2').value;
    fetch(`http://localhost:5000/search/table2/${searchColumn}/${searchValue}`)
        .then(response => response.json()).then(data => loadHTMLTable(data['data'], 'table2'));
};

const searchButton4 = document.querySelector('#search_button4');
searchButton4.onclick = function () {
    const searchValue = document.querySelector('#search_input4').value;
    const searchColumn = document.querySelector('#search_column4').value;
    fetch(`http://localhost:5000/search/table4/${searchColumn}/${searchValue}`)
        .then(response => response.json()).then(data => loadHTMLTable(data['data'], 'table4'));
};

const searchButton5 = document.querySelector('#search_button5');
searchButton5.onclick = function () {
    const searchValue = document.querySelector('#search_input5').value;
    const searchColumn = document.querySelector('#search_column5').value;
    fetch(`http://localhost:5000/search/table5/${searchColumn}/${searchValue}`)
        .then(response => response.json()).then(data => loadHTMLTable(data['data'], 'table5'));
};

const resetButton1 = document.querySelector('#reset_button1');
resetButton1.addEventListener('click', function () {
    document.querySelector('#search_input1').value = '';
});
resetButton1.onclick = function () {
    fetch(`http://localhost:5000/getAll/table1`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table1`));
};

const resetButton2 = document.querySelector('#reset_button2');
resetButton2.addEventListener('click', function () {
    document.querySelector('#search_input2').value = '';
});
resetButton2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table2`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table2`));
};

const resetButton2_2 = document.querySelector('#reset_button2_2');
resetButton2_2.addEventListener('click', function () {
    document.querySelector('#search_input2').value = '';
});
resetButton2_2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table2`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table2`));
};

const resetButton4 = document.querySelector('#reset_button4');
resetButton4.addEventListener('click', function () {
    document.querySelector('#search_input4').value = '';
});
resetButton4.onclick = function () {
    fetch(`http://localhost:5000/getAll/table4`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table4`));
};

const resetButton4_2 = document.querySelector('#reset_button4_2');
resetButton4_2.addEventListener('click', function () {
    document.querySelector('#search_input4').value = '';
});
resetButton4_2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table4`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table4`));
};

const resetButton4_3 = document.querySelector('#reset_button4_3');
resetButton4_3.addEventListener('click', function () {
    document.querySelector('#search_input4').value = '';
    document.querySelector('#tax_type').selectedIndex = 0;
    document.querySelector('#water_coef').classList.add('hidden');
    document.querySelector('#place_coef').classList.add('hidden');

    const coefInCity = document.getElementById('coef_in_city');
    const coefOutCity = document.getElementById('coef_out_city');
    const coefYes = document.getElementById('coef_yes');
    const coefNo = document.getElementById('coef_no');

    const resetButton = document.getElementById('reset_button4_3');

    resetButton.addEventListener('click', function () {
        coefInCity.checked = false;
        coefOutCity.checked = false;
        coefYes.checked = false;
        coefNo.checked = false;
    });
});
resetButton4_3.onclick = function () {
    fetch(`http://localhost:5000/getAll/table4`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table4`));
};

const resetButton5 = document.querySelector('#reset_button5');
resetButton5.addEventListener('click', function () {
    document.querySelector('#search_input5').value = '';
});
resetButton5.onclick = function () {
    fetch(`http://localhost:5000/getAll/table5`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table5`));
};

const resetButton5_2 = document.querySelector('#reset_button5_2');
resetButton5_2.addEventListener('click', function () {
    document.querySelector('#search_input5').value = '';
});
resetButton5_2.onclick = function () {
    fetch(`http://localhost:5000/getAll/table5`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table5`));
};

const resetButton5_3 = document.querySelector('#reset_button5_3');
resetButton5_3.addEventListener('click', function () {
    document.querySelector('#search_input5').value = '';
    document.querySelector('#tax_type2').selectedIndex = 0;
    document.querySelector('#water_coef').classList.add('hidden');
    document.querySelector('#place_coef').classList.add('hidden');

    const coefLake = document.getElementById('coef_lake');
    const coefRiver = document.getElementById('coef_river');

    const coefInCity = document.getElementById('coef_in_city');
    const coefOutCity = document.getElementById('coef_out_city');

    const coefYes = document.getElementById('coef_yes');
    const coefNo = document.getElementById('coef_no');

    const resetButton = document.getElementById('reset_button5_3');

    resetButton.addEventListener('click', function () {
        coefLake.checked = false;
        coefRiver.checked = false;

        coefInCity.checked = false;
        coefOutCity.checked = false;

        coefYes.checked = false;
        coefNo.checked = false;
    });
});
resetButton5_3.onclick = function () {
    fetch(`http://localhost:5000/getAll/table5`).then(response => response.json())
        .then(data => loadHTMLTable(data['data'], `table5`));
};

function handleSort(tableId, sortColumn, sortOrder) {
    fetch(`http://localhost:5000/sort/table${tableId}/${sortColumn}/${sortOrder}`)
        .then(response => response.json()).then(data => loadHTMLTable(data['data'], `table${tableId}`));
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

const sortButton5 = document.querySelector('#sort_button5');
sortButton5.onclick = function () {
    const sortColumn = document.querySelector('#sort_column5').value;
    const sortOrder = document.querySelector('#sort_order5').value;
    handleSort(5, sortColumn, sortOrder);
};

const addButton1 = document.querySelector('#add_data1_button');
addButton1.onclick = function (e) {
    e.preventDefault();
    handleAddButton(1, ['#name_input', '#head_input', '#address_input', '#economic_activity_input',
        '#form_of_ownership_input'], 'http://localhost:5000/insert/table1', insertRowIntoTable1);
};

const addButton2 = document.querySelector('#add_data2_button');
addButton2.onclick = function (e) {
    e.preventDefault();
    handleAddButton(2, ['#name2_input', '#permissible_emissions_input', '#danger_class_input',
        '#tax_rate_aw_input', '#tax_rate_p_input'], 'http://localhost:5000/insert/table2', insertRowIntoTable2);
};

const addButton4 = document.querySelector('#add_data4_button');
addButton4.onclick = function (e) {
    e.preventDefault();
    const objectId = document.querySelector('#Objects_name_select').value;
    const pollutantId = document.querySelector('#Pollutants_name_select').value;
    const generalEmissions = document.querySelector('#general_emissions_input').value.trim();
    const date = document.querySelector('#date_input').value.trim();

    const requestData = {
        Objects_id: objectId,
        Pollutants_id: pollutantId,
        general_emissions: generalEmissions,
        date: date
    };

    fetch('http://localhost:5000/insert/table4', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => insertRowIntoTable4(data.data))
        .catch(error => console.error('Error:', error));
};

const addButton5 = document.querySelector('#add_data5_button');
addButton5.onclick = function (e) {
    e.preventDefault();
    const objectId = document.querySelector('#Objects_name2_select').value;
    const pollutantId = document.querySelector('#Pollutants_name2_select').value;
    const generalEmissions = document.querySelector('#general_emissions2_input').value.trim();
    const date = document.querySelector('#date2_input').value.trim();

    const requestData = {
        Objects_id: objectId,
        Pollutants_id: pollutantId,
        general_emissions: generalEmissions,
        date: date
    };

    fetch('http://localhost:5000/insert/table5', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => insertRowIntoTable5(data.data))
        .catch(error => console.error('Error:', error));
};

function loadHTMLTable(data, tableId) {
    const table = document.querySelector(`#${tableId} tbody`);
    let tableHTML = "";

    data.forEach(function (row) {
        tableHTML += "<tr>";

        Object.keys(row).forEach(function (key) {
            let value = row[key];

            if (typeof value === 'number') {
                if (value === -1) {
                    value = '-';
                } else if (key === 'tax' || key === 'tax_rate_aw') {
                    // Форматуємо числові значення з двома десятковими знаками
                    value = value.toFixed(2);
                }
            }

            tableHTML += `<td>${value}</td>`;
        });

        if (tableId !== 'table3') {
            tableHTML += `<td class="button"><button class="edit_row_button" data-id=${row.id}>Редагувати</button>
            <button class="delete_row_button" data-id=${row.id}>Видалити</button></td>`;
        }
        tableHTML += "</tr>";
    });

    table.innerHTML = tableHTML;
}

function handleTableClick(tableId, event) {
    if (event.target.className === "delete_row_button") {
        deleteRowById(event.target.dataset.id, tableId);
    } else if (event.target.className === "edit_row_button") {
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
    } else if (tableId === 5) {
        table = 'table5';
    }

    const url = `http://localhost:5000/delete/${table}/${id}`;

    fetch(url, {method: 'DELETE'}).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    }).catch(err => console.log(err));
}

function handleEditRow(id, tableId) {
    const row = document.querySelector(`table${tableId === 1 ? '' : tableId === 2 ? '#table2' :
        '#table4' ? '#table5' : ''} tr[data-id="${id}"]`);

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
                {name: 'permissible_emissions', selector: '.permissible_emissions'},
                {name: 'danger_class', selector: '.danger_class'},
                {name: 'tax_rate_aw', selector: '.tax_rate_aw'},
                {name: 'tax_rate_p', selector: '.tax_rate_p'}
            ]
        }
    };

    const {idInput, fields: fieldDefinitions} = fields[tableId];
    document.querySelector(idInput).dataset.id = id;

    fieldDefinitions.forEach(field => {
        document.querySelector(`#${field.name}_input`).value = row.querySelector(field.selector).textContent;
    });

    if (tableId === 4) {
        const row = document.querySelector(`#table4 tr[data-id="${id}"]`);
        document.querySelector('#Objects_name_select').value = row.querySelector('.Objects_name_select')
            .textContent;
        document.querySelector('#Pollutants_name_select').value = row.querySelector('.Pollutants_name_select')
            .textContent;
        document.querySelector('#general_emissions_input').value = row.querySelector('.general_emissions')
            .textContent;
        document.querySelector('#date_input').value = row.querySelector('.date').textContent;

        document.querySelector('#Objects_name_select').dataset.id = id;
    } else if (tableId === 5) {
        const row = document.querySelector(`#table5 tr[data-id="${id}"]`);
        document.querySelector('#Objects_name2_select').value = row.querySelector('.Objects_name2_select')
            .textContent;
        document.querySelector('#Pollutants_name2_select').value = row.querySelector('.Pollutants_name2_select')
            .textContent;
        document.querySelector('#general_emissions2_input').value = row.querySelector('.general_emissions2')
            .textContent;
        document.querySelector('#date2_input').value = row.querySelector('.date2').textContent;

        document.querySelector('#Objects_name2_select').dataset.id = id;
    }
}

function handleAddButton(tableId, inputSelectors, endpoint, insertRowFunction) {
    const values = inputSelectors.map(selector => document.querySelector(selector).value.trim());

    const requestData =
        tableId === 1 ? {
                name: values[0], head: values[1], address: values[2], economic_activity: values[3],
                form_of_ownership: values[4]
            }
            : tableId === 2 ? {
                    name: values[0], permissible_emissions: values[1], danger_class: values[2],
                    tax_rate_aw: values[3], tax_rate_p: values[4]
                }
                : tableId === 4 ? {
                        Objects_id: values[0], Pollutants_id: values[1], general_emissions: values[2],
                        date: values[3]
                    }
                    : {
                        Objects_id: values[0], Pollutants_id: values[1], general_emissions: values[2],
                        date: values[3]
                    }

    fetch(endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
        .then(response => response.json()).catch(error => {
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
            {name: 'permissible_emissions', id: 'permissible_emissions_input'},
            {name: 'danger_class', id: 'danger_class_input'},
            {name: 'tax_rate_aw', id: 'tax_rate_aw_input'},
            {name: 'tax_rate_p', id: 'tax_rate_p_input'}
        ],
        table4: [
            {name: 'Objects_id', id: 'Objects_name_select'},
            {name: 'Pollutants_id', id: 'Pollutants_name_select'},
            {name: 'general_emissions', id: 'general_emissions_input'},
            {name: 'date', id: 'date_input'}
        ],
        table5: [
            {name: 'Objects_id', id: 'Objects_name2_select'},
            {name: 'Pollutants_id', id: 'Pollutants_name2_select'},
            {name: 'general_emissions', id: 'general_emissions2_input'},
            {name: 'date', id: 'date2_input'}
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
        body: JSON.stringify({id: id, ...formData})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => {
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
    insertRowIntoTable('#table2', data, ['id', 'name', 'permissible_emissions',
        'danger_class', 'tax_rate_aw', 'tax_rate_p']);
}

function insertRowIntoTable4(data) {
    insertRowIntoTable('#table4', data, ['id', 'Objects_id', 'Pollutants_id', 'general_emissions',
        'date']);
}

function insertRowIntoTable5(data) {
    insertRowIntoTable('#table5', data, ['id', 'Objects_id', 'Pollutants_id', 'general_emissions',
        'date']);
}

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) targetElement.scrollIntoView({behavior: 'smooth'});
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

const showFormButton5 = document.querySelector('#show_form_button5');
showFormButton5.onclick = async function () {
    const formContainer = document.querySelector('#form_container5');

    changeForm('#form_title5', 'Додати нове забруднення');
    changeForm('#add_data5_button', 'Додати нове забруднення');

    document.querySelector('#add-pollutions2-form').reset();
    formContainer.classList.toggle('hidden');
};

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit_row_button')) {
        let formContainer;
        let button;
        let updateButton;

        if (event.target.closest('#table1')) {
            formContainer = document.querySelector('#form_container1');
            button = document.querySelector('#add_data1_button');
            updateButton = document.querySelector('#update_row1_button') || button;

            if (formContainer.classList.contains('hidden')) {
                changeForm('#form_title1', 'Редагувати дані підприємства');
                changeForm('#add_data1_button', 'Зберегти зміни');
                button.id = 'update_row1_button';
                updateButton.onclick = () => handleUpdate('table1');
            } else {
                changeForm('#form_title1', 'Додати нове підприємство');
                changeForm('#update_row1_button', 'Додати нове підприємство');
                updateButton.id = 'add_data1_button';
                document.querySelector('#add-enterprise-form').reset();
            }
        } else if (event.target.closest('#table2')) {
            formContainer = document.querySelector('#form_container2');
            button = document.querySelector('#add_data2_button');
            updateButton = document.querySelector('#update_row2_button') || button;

            if (formContainer.classList.contains('hidden')) {
                changeForm('#form_title2', 'Редагувати дані речовини');
                changeForm('#add_data2_button', 'Зберегти зміни');
                button.id = 'update_row2_button';
                updateButton.onclick = () => handleUpdate('table2');
            } else {
                changeForm('#form_title2', 'Додати нову речовину');
                changeForm('#update_row2_button', 'Додати нову речовину');
                updateButton.id = 'add_data2_button';
                document.querySelector('#add-substance-form').reset();
            }
        } else if (event.target.closest('#table4')) {
            formContainer = document.querySelector('#form_container4');
            button = document.querySelector('#add_data4_button');
            updateButton = document.querySelector('#update_row4_button') || button;

            if (formContainer.classList.contains('hidden')) {
                changeForm('#form_title4', 'Редагувати дані забруднення');
                changeForm('#add_data4_button', 'Зберегти зміни');
                button.id = 'update_row4_button';
                updateButton.onclick = () => handleUpdate('table4');

                document.querySelector('#Objects_name_select').dataset.id = event.target.dataset.id;
            } else {
                changeForm('#form_title4', 'Додати нове забруднення');
                changeForm('#update_row4_button', 'Додати нове забруднення');
                updateButton.id = 'add_data4_button';
                document.querySelector('#add-pollutions-form').reset();
            }
        } else if (event.target.closest('#table5')) {
            formContainer = document.querySelector('#form_container5');
            button = document.querySelector('#add_data5_button');
            updateButton = document.querySelector('#update_row5_button') || button;

            if (formContainer.classList.contains('hidden')) {
                changeForm('#form_title5', 'Редагувати дані забруднення');
                changeForm('#add_data5_button', 'Зберегти зміни');
                button.id = 'update_row5_button';
                updateButton.onclick = () => handleUpdate('table5');

                document.querySelector('#Objects_name2_select').dataset.id = event.target.dataset.id;
            } else {
                changeForm('#form_title5', 'Додати нове забруднення');
                changeForm('#update_row5_button', 'Додати нове забруднення');
                updateButton.id = 'add_data5_button';
                document.querySelector('#add-pollutions2-form').reset();
            }
        }

        formContainer.classList.toggle('hidden');
    }
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('tax_button')) {
        const selectedTaxType = document.querySelector('#tax_type').value;

        if (selectedTaxType === 'tax_air') {
            const taxButton = document.querySelector('#tax_button');
            taxButton.id = 'calculate_air_button';
        } else if (selectedTaxType === 'tax_placement') {
            document.querySelector('#place_coef').classList.toggle('hidden');
        }
    } else if (event.target.classList.contains('tax_button2')) {
        const selectedTaxType = document.querySelector('#tax_type2').value;

        if (selectedTaxType === 'tax_water') {
            document.querySelector('#water_coef').classList.toggle('hidden');
        } else if (selectedTaxType === 'tax_placement') {
            document.querySelector('#place_coef').classList.toggle('hidden');
        }
    }
});

document.getElementById('button_air').addEventListener('click', function (event) {
    document.querySelector('#table-container4').classList.toggle('hidden');
    document.querySelector('#show_form_button4').classList.toggle('hidden');
    document.querySelector('#search_column4').classList.toggle('hidden');
    document.querySelector('#search_input4').classList.toggle('hidden');
    document.querySelector('#search_button4').classList.toggle('hidden');
    document.querySelector('#reset_button4').classList.toggle('hidden');
    document.querySelector('#sort_column4').classList.toggle('hidden');
    document.querySelector('#sort_order4').classList.toggle('hidden');
    document.querySelector('#sort_button4').classList.toggle('hidden');
    document.querySelector('#reset_button4_2').classList.toggle('hidden');
    document.querySelector('#tax_type').classList.toggle('hidden');
    document.querySelector('#tax_button').classList.toggle('hidden');
    document.querySelector('#reset_button4_3').classList.toggle('hidden');
    document.querySelector('#water_coef').classList.toggle('hidden');
    document.querySelector('#place_coef').classList.toggle('hidden');

    document.querySelector('#table-container5').classList.add('hidden');
    document.querySelector('#show_form_button5').classList.add('hidden');
    document.querySelector('#search_column5').classList.add('hidden');
    document.querySelector('#search_input5').classList.add('hidden');
    document.querySelector('#search_button5').classList.add('hidden');
    document.querySelector('#reset_button5').classList.add('hidden');
    document.querySelector('#sort_column5').classList.add('hidden');
    document.querySelector('#sort_order5').classList.add('hidden');
    document.querySelector('#sort_button5').classList.add('hidden');
    document.querySelector('#reset_button5_2').classList.add('hidden');
    document.querySelector('#tax_type2').classList.add('hidden');
    document.querySelector('#tax_button2').classList.add('hidden');
    document.querySelector('#reset_button5_3').classList.add('hidden');
    document.querySelector('#water_coef').classList.add('hidden');
    document.querySelector('#place_coef').classList.add('hidden');
});

document.getElementById('button_water').addEventListener('click', function (event) {
    document.querySelector('#table-container5').classList.toggle('hidden');
    document.querySelector('#show_form_button5').classList.toggle('hidden');
    document.querySelector('#search_column5').classList.toggle('hidden');
    document.querySelector('#search_input5').classList.toggle('hidden');
    document.querySelector('#search_button5').classList.toggle('hidden');
    document.querySelector('#reset_button5').classList.toggle('hidden');
    document.querySelector('#sort_column5').classList.toggle('hidden');
    document.querySelector('#sort_order5').classList.toggle('hidden');
    document.querySelector('#sort_button5').classList.toggle('hidden');
    document.querySelector('#reset_button5_2').classList.toggle('hidden');
    document.querySelector('#tax_type2').classList.toggle('hidden');
    document.querySelector('#tax_button2').classList.toggle('hidden');
    document.querySelector('#reset_button5_3').classList.toggle('hidden');
    document.querySelector('#water_coef').classList.toggle('hidden');
    document.querySelector('#place_coef').classList.toggle('hidden');

    document.querySelector('#table-container4').classList.add('hidden');
    document.querySelector('#show_form_button4').classList.add('hidden');
    document.querySelector('#search_column4').classList.add('hidden');
    document.querySelector('#search_input4').classList.add('hidden');
    document.querySelector('#search_button4').classList.add('hidden');
    document.querySelector('#reset_button4').classList.add('hidden');
    document.querySelector('#sort_column4').classList.add('hidden');
    document.querySelector('#sort_order4').classList.add('hidden');
    document.querySelector('#sort_button4').classList.add('hidden');
    document.querySelector('#reset_button4_2').classList.add('hidden');
    document.querySelector('#tax_type').classList.add('hidden');
    document.querySelector('#tax_button').classList.add('hidden');
    document.querySelector('#reset_button4_3').classList.add('hidden');
    document.querySelector('#water_coef').classList.add('hidden');
    document.querySelector('#place_coef').classList.add('hidden');
});

const checkboxes1 = document.querySelectorAll('.water_coef input[type="checkbox"]')
checkboxes1.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            checkboxes1.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

const checkboxes2 = document.querySelectorAll('.place_coef1 input[type="checkbox"]');
checkboxes2.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            checkboxes2.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

const checkboxes3 = document.querySelectorAll('.place_coef2 input[type="checkbox"]');
checkboxes3.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            checkboxes3.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

const checkboxes4 = document.querySelectorAll('.coef-option_rw1 input[type="checkbox"]');
checkboxes4.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            checkboxes4.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

const checkboxes5 = document.querySelectorAll('.coef-option_rw2 input[type="checkbox"]');
checkboxes5.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            checkboxes5.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

document.addEventListener('click', function (event) {
    if (event.target.id === 'calculate_air_button') {
        calculateTax('table1', 'calculate_air_button', 1, 1);
    } else if (event.target.id === 'calculate_water_button') {
        let coef = 1;
        const coefLake = document.querySelector('#coef_lake');
        const coefRiver = document.querySelector('#coef_river');

        if (coefLake.checked) {
            coef = parseFloat(coefLake.value);
        } else if (coefRiver.checked) {
            coef = parseFloat(coefRiver.value);
        }

        calculateTax('table2', 'calculate_water_button', coef, 1);
    } else if (event.target.id === 'calculate_place_button') {
        let coef1 = 1;
        const coefInCity = document.querySelector('#coef_in_city');
        const coefOutCity = document.querySelector('#coef_out_city');

        if (coefInCity.checked) {
            coef1 = parseFloat(coefInCity.value);
        } else if (coefOutCity.checked) {
            coef1 = parseFloat(coefOutCity.value);
        }

        let coef2 = 1;
        const coefYes = document.querySelector('#coef_yes');
        const coefNo = document.querySelector('#coef_no');

        if (coefYes.checked) {
            coef2 = parseFloat(coefYes.value);
        } else if (coefNo.checked) {
            coef2 = parseFloat(coefNo.value);
        }

        const buttonAir = document.getElementById('button_air');
        const buttonWater = document.getElementById('button_water');

        if (buttonAir && buttonAir.classList.contains('active')) {
            calculateTax('table4', 'calculate_place_button', coef1, coef2);
        } else if (buttonWater && buttonWater.classList.contains('active')) {
            calculateTax('table5', 'calculate_place_button', coef1, coef2);
        }
    }
});

function calculateTax(table, type_tax_button, coef1, coef2) {
    fetch(`http://localhost:5000/calculateTax`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({table: table, type_tax_button: type_tax_button, coef1: coef1, coef2: coef2}),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Податок успішно обчислено:', data);
            alert('Податок обчислено');

            if (type_tax_button === 'calculate_air_button') {
                fetch('http://localhost:5000/getAll/table4')
                    .then(response => response.json())
                    .then(data => loadHTMLTable(data['data'], 'table4'));
            } else if (type_tax_button === 'calculate_water_button') {
                fetch('http://localhost:5000/getAll/table5')
                    .then(response => response.json())
                    .then(data => loadHTMLTable(data['data'], 'table5'));
            } else if (type_tax_button === 'calculate_place_button') {
                if (table === 'table4') {
                    fetch('http://localhost:5000/getAll/table4')
                        .then(response => response.json())
                        .then(data => loadHTMLTable(data['data'], 'table4'));
                } else if (table === 'table5') {
                    fetch('http://localhost:5000/getAll/table5')
                        .then(response => response.json())
                        .then(data => loadHTMLTable(data['data'], 'table5'));
                }
            }
        }).catch((error) => {
        console.error('Помилка при обчисленні податку:', error);
        alert('Не вдалося обчислити податок');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const airButton = document.getElementById('button_air');
    const waterButton = document.getElementById('button_water');

    function setActiveButton(activeButton, inactiveButton) {
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
    }

    airButton.addEventListener('click', function () {
        setActiveButton(airButton, waterButton);
    });

    waterButton.addEventListener('click', function () {
        setActiveButton(waterButton, airButton);
    });
});

function populateDropdowns() {
    fetch('http://localhost:5000/getAll/table1')
        .then(response => response.json())
        .then(data => {
            const objectSelect = document.querySelector('#Objects_name_select');
            data.data.forEach(object => {
                const option = document.createElement('option');
                option.value = object.id;
                option.textContent = object.name;
                objectSelect.appendChild(option);
            });
        });

    fetch('http://localhost:5000/getAll/table2')
        .then(response => response.json())
        .then(data => {
            const pollutantSelect = document.querySelector('#Pollutants_name_select');
            data.data.forEach(pollutant => {
                const option = document.createElement('option');
                option.value = pollutant.id;
                option.textContent = pollutant.name;
                pollutantSelect.appendChild(option);
            });
        });
}

function populateDropdowns2() {
    fetch('http://localhost:5000/getAll/table1')
        .then(response => response.json())
        .then(data => {
            const objectSelect = document.querySelector('#Objects_name2_select');
            data.data.forEach(object => {
                const option = document.createElement('option');
                option.value = object.id;
                option.textContent = object.name;
                objectSelect.appendChild(option);
            });
        });

    fetch('http://localhost:5000/getAll/table2')
        .then(response => response.json())
        .then(data => {
            const pollutantSelect = document.querySelector('#Pollutants_name2_select');
            data.data.forEach(pollutant => {
                const option = document.createElement('option');
                option.value = pollutant.id;
                option.textContent = pollutant.name;
                pollutantSelect.appendChild(option);
            });
        });
}

document.addEventListener('DOMContentLoaded', populateDropdowns);
document.addEventListener('DOMContentLoaded', populateDropdowns2);