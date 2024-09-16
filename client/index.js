document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5000/getAll').then(response => response.json()).
    then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete_row_button") {
        deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === "edit_row_button") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateButton = document.querySelector('#update_row_button');
const searchButton = document.querySelector('#search_button');

searchButton.onclick = function () {
    const searchValue = document.querySelector('#search_input').value;

    fetch('http://localhost:5000/search/' + searchValue).then(response => response.json()).
        then(data => loadHTMLTable(data['data']));
};

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow(id) {
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

    fetch('http://localhost:5000/update', {
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

const addButton = document.querySelector('#add_data_button');

function addData() {
    const name = document.querySelector('#name_input').value.trim();
    const head = document.querySelector('#head_input').value.trim();
    const address = document.querySelector('#address_input').value.trim();
    const economicActivity = document.querySelector('#economic_activity_input').value.trim();
    const formOfOwnership = document.querySelector('#form_of_ownership_input').value.trim();

    if (!name || !head || !address || !economicActivity || !formOfOwnership) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    fetch('http://localhost:5000/insert', {
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
    }).then(response => response.json()).then(data => insertRowIntoTable(data.data));
}

addButton.onclick = function () {
    addData();
};

nameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addData();
    }
});

function insertRowIntoTable(data) {
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

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no_data' colspan='6'>No data</td></tr>";
        return;
    }

    let tableHTML = "";
    data.forEach(function ({id, name, head, address, economic_activity, form_of_ownership}) {
        tableHTML += "<tr>";
        tableHTML += `<td>${id}</td>`;
        tableHTML += `<td>${name}</td>`;
        tableHTML += `<td>${head}</td>`;
        tableHTML += `<td>${address}</td>`;
        tableHTML += `<td>${economic_activity}</td>`;
        tableHTML += `<td>${form_of_ownership}</td>`;
        tableHTML += `<td><button class="delete_row_button" data-id=${id}>Delete</button></td>`;
        tableHTML += `<td><button class="edit_row_button" data-id=${id}>Edit</button></td>`;
        tableHTML += "</tr>";
    });
    table.innerHTML = tableHTML;
}