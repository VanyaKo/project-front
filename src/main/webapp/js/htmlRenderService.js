function renderPagingButtons(pages) {
    for (let i = 0; i < pages; i++) {
        const buttonTag = `<button>${i + 1}</button>`
        const button = $(buttonTag)
            .attr('id', 'paging-button-' + i)
            .attr('onclick', `showList(${i})`)
            .addClass('unselected-paging-button')
        $('#paging-buttons').append(button)
    }
}

function renderTableRaw(user) {
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
}

function renderEditRaw(editButtonId, id) {
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

function getDropdownHtml(id, name, values) {
    const nameId = `select-${name}-` + id;
    let dropdownHtml = `<label for="${name}"></label>` + `<select id="${nameId}" name=${name}>`;

    values.map(function (value) {
        dropdownHtml += `<option value="${value}">${value}</option>`
    })
    return dropdownHtml + '</select>'
}