document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAll').then(response => response.json()).
        then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete_row_button") {
        deleteRowById(event.target.dataset.id_Object);
    }

    if (event.target.className === "edit_row_button") {
        handleEditRow(event.target.dataset.id_Object);
    }
});

const updateButton = document.querySelector('#update_row_button');
const searchButton = document.querySelector('#search_button');

searchButton.onclick = function () {
    const searchValue = document.querySelector('#search_input').value;

    fetch('http://localhost:5000/search/' + searchValue).then(response => response.json()).
        then(data => loadHTMLTable(data['data']));
};

function deleteRowById(id_Object) {
    fetch('http://localhost:5000/delete/' + id_Object, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow(id_Object) {
    const updateRow = document.querySelector('#update_row');
    updateRow.hidden = false;
    document.querySelector('#update_name_input').dataset.id_Object = id_Object;
}

updateButton.onclick = function () {
    const updateNameInput = document.querySelector('#update_name_input');

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_Object: updateNameInput.dataset.id_Object,
            name: updateNameInput.value
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
};

const addButton = document.querySelector('#add_name_button');
const nameInput = document.querySelector('#name_input');

function addName() {
    const name = nameInput.value;
    nameInput.value = "";

    fetch(`http://localhost:5000/insert`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    }).then(response => response.json()).then(data => insertRowIntoTable(data['data']));
}

addButton.onclick = function () {
    addName();
};

nameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addName();
    }
});

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no_data');

    let tableHTML = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            tableHTML += `<td>${data[key]}</td>`;
        }
    }

    tableHTML += `<td><button class="delete_row_button" data-id=${data.id_Object}>Delete</button></td>`;
    tableHTML += `<td><button class="edit_row_button" data-id=${data.id_Object}>Edit</button></td>`;
    tableHTML += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHTML;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no_data' colspan='6'>No data</td></tr>";
        return;
    }

    let tableHTML = "";
    data.forEach(function ({id_Object, name, head, address, economic_activity, form_of_ownership}) {
        tableHTML += "<tr>";
        tableHTML += `<td>${id_Object}</td>`;
        tableHTML += `<td>${name}</td>`;
        tableHTML += `<td>${head}</td>`;
        tableHTML += `<td>${address}</td>`;
        tableHTML += `<td>${economic_activity}</td>`;
        tableHTML += `<td>${form_of_ownership}</td>`;
        tableHTML += `<td><button class="delete_row_button" data-id=${id_Object}>Delete</button></td>`;
        tableHTML += `<td><button class="edit_row_button" data-id=${id_Object}>Edit</button></td>`;
        tableHTML += "</tr>";
    });
    table.innerHTML = tableHTML;
}