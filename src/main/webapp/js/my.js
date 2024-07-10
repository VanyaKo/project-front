function showList(pageNumber) {
    $('tr:has(td)').remove()

    const url = '/rest/players'
    const pageSize = $('#page-size-selector').val();

    $.get(url,
        {'pageSize': pageSize, 'pageNumber': pageNumber || 0},
        function (response) {
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

    $('button.unselected-paging-button').remove()
    for (let i = 0; i < pages; i++) {
        const buttonTag = `<button>${i + 1}</button>`
        const button = $(buttonTag)
            .attr('id', 'paging-button-' + i)
            .attr('onclick', `showList(${i})`)
            .addClass('unselected-paging-button')
        $('#paging-buttons').append(button)
    }

    const pagingButtonId = '#paging-button-' + pageNumber
    $(pagingButtonId).css({'color': 'red', 'font-weight': 'bold'})
}

function getTotalCount() {
    const url = '/rest/players/count'
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

//TODO: update when delete last user from page
function deleteUser(id) {
    const url = `/rest/players/${id}`
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
    tdRace.innerHTML = getDropdownRaceHtml(id)
    $(raceId).val(raceCurrentValue).change()

    const tdProfession = children[4]
    const professionId = '#select-profession-' + id
    const professionCurrentValue = tdProfession.innerHTML
    tdProfession.innerHTML = getDropdownProfessionHtml(id)
    $(professionId).val(professionCurrentValue).change()

    const tdBanned = children[7]
    const bannedId = '#select-banned-' + id
    const bannedCurrentValue = tdBanned.innerHTML
    tdBanned.innerHTML = getDropdownBannedHtml(id)
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

    const url = '/rest/players'
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

    const url = `/rest/players/${id}`
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

// TODO: ass style for button specifically in css file
function getDropdownRaceHtml(id) {
    const raceId = 'select-race-' + id;
    return '<label for="race"></label>'
        + `<select id="${raceId}" name="race">`
        + '<option value="HUMAN">HUMAN</option>'
        + '<option value="DWARF">DWARF</option>'
        + '<option value="ELF">ELF</option>'
        + '<option value="GIANT">GIANT</option>'
        + '<option value="ORC">ORC</option>'
        + '<option value="TROLL">TROLL</option>'
        + '<option value="HOBBIT">HOBBIT</option>'
        + '</select>'
}

function getDropdownProfessionHtml(id) {
    const professionId = 'select-profession-' + id;
    return '<label for="profession"></label>'
        + `<select id="${professionId}" name="profession">`
        + '<option value="WARRIOR">WARRIOR</option>'
        + '<option value="ROGUE">ROGUE</option>'
        + '<option value="SORCERER">SORCERER</option>'
        + '<option value="CLERIC">CLERIC</option>'
        + '<option value="PALADIN">PALADIN</option>'
        + '<option value="NAZGUL">NAZGUL</option>'
        + '<option value="WARLOCK">WARLOCK</option>'
        + '<option value="DRUID">DRUID</option>'
        + '</select>'
}

function getDropdownBannedHtml(id) {
    const bannedId = 'select-banned-' + id;
    return '<label for="banned"></label>'
        + `<select id="${bannedId}" name="banned">`
        + '<option value="false">false</option>'
        + '<option value="true">true</option>'
        + '</select>'
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