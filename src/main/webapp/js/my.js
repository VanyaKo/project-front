const htmlRenderService = new HtmlRenderService()
const PLAYERS_URL = '/rest/players'

function showButtons(pages) {
    $('button.unselected-paging-button').remove()
    htmlRenderService.renderPagingButtons(pages);
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
                htmlRenderService.renderTableRaw(user);
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
    htmlRenderService.renderEditRaw(editButtonId, id);
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

function getCurrentPage() {
    let currentPage = 1;
    $('button:parent(div)').each(function () {
        if ($(this).css('color') === 'rgb(255, 0, 0)') {
            currentPage = $(this).text();
        }
    });
    return parseInt(currentPage) - 1
}