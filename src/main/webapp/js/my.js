const PLAYERS_URL = '/rest/players'

function showButtons(pages) {
    $('button.unselected-paging-button').remove()
    for (let i = 0; i < pages; i++) {
        const buttonTag = `<button>${i + 1}</button>`
        const button = $(buttonTag)
            .attr('id', 'paging-button-' + i)
            .attr('onclick', `showList(${i})`)
            .addClass('unselected-paging-button')
        $('#paging-buttons').append(button)
    }
}

function markCurrentPagingButton(pageNumber) {
    const pagingButtonId = '#paging-button-' + pageNumber
    $(pagingButtonId).css({'color': 'red', 'font-weight': 'bold'})
}

function showList(pageNumber) {
    $('tr:has(td)').remove()

    const pageSize = $('#page-size-selector').val();

    $.get(PLAYERS_URL,
        {'pageSize': pageSize, 'pageNumber': pageNumber || 0},
        function (response) {
            if (response.length === 0) {
                showList(--pageNumber)
            }
            $.each(response, function (i, user) {
                $('<tr>').html(
                    `<td>${user.id}</td>`
                    + `<td>${user.name}</td>`
                    + `<td>${user.title}</td>`
                    + `<td>${user.race}</td>`
                    + `<td>${user.profession}</td>`
                    + `<td>${user.level}</td>`
                    + `<td>${new Date(user.birthday).toLocaleDateString()}</td>`
                    + `<td>${user.banned}</td>`
                    + '<td>'
                    + `<button id="edit-button-${user.id}" onclick="editUser(${user.id})">`
                    + '<img src="/img/edit.png" alt="edit">'
                    + '</button>'
                    + '</td>'
                    + '<td>'
                    + `<button id="delete-button-${user.id}" onclick="deleteUser(${user.id})">`
                    + '<img src="/img/delete.png" alt="delete">'
                    + '</button>'
                    + '</td>'
                ).appendTo('#admin-table')
            });
        }
    )

    const totalCount = getTotalCount()
    const pages = Math.ceil(totalCount / pageSize)
    showButtons(pages);
    markCurrentPagingButton(pageNumber);
}

function getTotalCount() {
    const url = `${PLAYERS_URL}/count`
    let res = 0
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            res = parseInt(result)
        }
    })
    return res
}

function deleteUser(id) {
    const url = `${PLAYERS_URL}/${id}`
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            showList(getCurrentPage())
        },
    })
}

function editUser(id) {
    const editButtonId = `#edit-button-${id}`
    const deleteButtonId = `#delete-button-${id}`

    $(deleteButtonId).remove()

    const saveImageTag = '<img src="/img/save.png" alt="save">'
    $(editButtonId).html(saveImageTag)

    const currentTrElement = $(editButtonId).parent().parent()
    const children = currentTrElement.children()

    const tdName = children[1]
    tdName.innerHTML = `<input id="input-name-${id}" type="text" value="${tdName.innerHTML}">`

    const tdTitle = children[2]
    tdTitle.innerHTML = `<input id="input-title-${id}" type="text" value="${tdTitle.innerHTML}">`

    const tdRace = children[3]
    const raceId = '#select-race-' + id
    const raceCurrentValue = tdRace.innerHTML
    tdRace.innerHTML = getDropdownHtml(id, 'race', ['HUMAN', 'DWARF', 'ELF', 'GIANT', 'ORC', 'TROLL', 'HOBBIT'])
    $(raceId).val(raceCurrentValue).change()

    const tdProfession = children[4]
    const professionId = '#select-profession-' + id
    const professionCurrentValue = tdProfession.innerHTML
    tdProfession.innerHTML = getDropdownHtml(id, 'profession', ['WARRIOR', 'ROGUE', 'SORCERER', 'CLERIC', 'PALADIN', 'NAZGUL', 'WARLOCK', 'DRUID'])
    $(professionId).val(professionCurrentValue).change()

    const tdBanned = children[7]
    const bannedId = '#select-banned-' + id
    const bannedCurrentValue = tdBanned.innerHTML
    tdBanned.innerHTML = getDropdownHtml(id, 'banned', [false, true])
    $(bannedId).val(bannedCurrentValue).change()

    const propertySaveTag = `saveUser(${id})`
    $(editButtonId).attr('onclick', propertySaveTag)
}

function createUser() {
    const valueName = $('#input-name-new').val()
    const valueTitle = $('#input-title-new').val()
    const valueRace = $('#select-race-new').val()
    const valueProfession = $('#select-profession-new').val()
    const valueLevel = $('#input-level-new').val()
    const valueBirthday = $('#input-birthday-new').val()
    const valueBanned = $('#select-banned-new').val()

    $.ajax({
        url: PLAYERS_URL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": valueName,
            "title": valueTitle,
            "race": valueRace,
            "profession": valueProfession,
            "level": valueLevel,
            "birthday": new Date(valueBirthday).getTime(),
            "banned": valueBanned
        }),
        success: function () {
            $('#input-name-new').val("")
            $('#input-title-new').val("")
            $('#select-race-new').val("")
            $('#select-profession-new').val("")
            $('#input-level-new').val("")
            $('#input-birthday-new').val("")
            $('#select-banned-new').val("")
            showList(getCurrentPage())
        }
    })
}

function saveUser(id) {
    const valueName = $('#input-name-' + id).val()
    const valueTitle = $('#input-title-' + id).val()
    const valueRace = $('#select-race-' + id).val()
    const valueProfession = $('#select-profession-' + id).val()
    const valueBanned = $('#select-banned-' + id).val()

    const url = `${PLAYERS_URL}/${id}`
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": valueName,
            "title": valueTitle,
            "race": valueRace,
            "profession": valueProfession,
            "banned": valueBanned
        }),
        success: function () {
            showList(getCurrentPage())
        }
    })
}
function getDropdownHtml(id, name, values) {
    const nameId = `select-${name}-` + id;
    let dropdownHtml = `<label for="${name}"></label>` + `<select id="${nameId}" name=${name}>`;

    values.map(function (value) {
        dropdownHtml += `<option value="${value}">${value}</option>`
    })
    return dropdownHtml + '</select>'
}

function getCurrentPage() {
    let currentPage = 1;
    $('button:parent(div)').each(function () {
        if ($(this).css('color') === 'rgb(255, 0, 0)') {
            currentPage = $(this).text();
        }
    });
    return parseInt(currentPage) - 1
}