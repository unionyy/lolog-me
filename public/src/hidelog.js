function HideLog() {
    $('#user-games-body').attr('hidden', true);
    $('.fa-caret-up').css('display', 'none');
    $('.fa-caret-down').css('display', 'inline');
}

function ShowLog() {
    $('#user-games-body').attr('hidden', false);
    $('.fa-caret-up').css('display', 'inline');
    $('.fa-caret-down').css('display', 'none');
}